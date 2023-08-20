'use strict';

const { TypeApply, DiscountType } = require('../constanst/discount.constants');
/*
  Discount Service
  1 - Generator Disscount Code [Shop | Admin]
  2 - Get discount amount [User]
  3 - Get all discount code [Users | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Admin | Shop]
  6 - Cancel discount code [User]
*/
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { discount } = require('../models/discount.model');
const {
  findDiscountCodesUnSelect,
  checkDiscountExists,
} = require('../models/repositories/discount.repo');
const { findAllProduct } = require('../models/repositories/product.repo');
const { convertStringToObjectId } = require('../utils');

class DiscountService {
  static async createDiscountCode(body) {
    const {
      name,
      description,
      code,
      type,
      value,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids,
    } = body;

    // check
    if (
      new Date() > new Date(start_date) ||
      new Date() > new Date(end_date) ||
      new Date(start_date) >= new Date(end_date)
    ) {
      throw new BadRequestError('Date invalid');
    }

    const discountExists = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertStringToObjectId(shopId),
      })
      .lean();

    if (discountExists) {
      throw new BadRequestError('Discount exists');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_code: code,
      discount_type: type,
      discount_value: value,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });
    return newDiscount;
  }

  static async updateDiscountCode(discountId, body) {
    const _id = convertStringToObjectId(discountId);
    const {
      name,
      description,
      code,
      type,
      value,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids,
    } = body;

    if (
      new Date() > new Date(start_date) ||
      new Date() > new Date(end_date) ||
      new Date(start_date) >= new Date(end_date)
    ) {
      throw new BadRequestError('Date invalid');
    }

    const discountExists = await discount
      .findOne({
        _id: { $ne: _id },
        discount_code: code,
        discount_shopId: convertStringToObjectId(shopId),
      })
      .lean();

    if (discountExists) {
      throw new BadRequestError('Discount exists');
    }

    const updateDiscount = await discount.updateOne(
      { _id },
      {
        $set: {
          discount_name: name,
          discount_description: description,
          discount_code: code,
          discount_type: type,
          discount_value: value,
          discount_start_date: start_date,
          discount_end_date: end_date,
          discount_max_uses: max_uses,
          discount_uses_count: uses_count,
          discount_users_used: users_used,
          discount_max_uses_per_user: max_uses_per_user,
          discount_min_order_value: min_order_value,
          discount_shopId: shopId,
          discount_is_active: is_active,
          discount_applies_to: applies_to,
          discount_product_ids: applies_to === 'all' ? [] : product_ids,
        },
      }
    );
    return updateDiscount;
  }

  static async getAllDiscountCodesWithProduct(body) {
    const { code, shopId, limit, page } = body;

    const discountExists = await discount
      .findOne({
        discount_shopId: convertStringToObjectId(shopId),
        discount_code: code,
      })
      .lean();

    if (!discountExists || !discountExists.discount_is_active) {
      throw new NotFoundError('Discount code not exists');
    }

    const { discount_applies_to, discount_product_ids } = discountExists;

    let products = [];
    if (discount_applies_to === 'all') {
      products = await findAllProduct({
        filter: {
          product_shop: convertStringToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }
    if (discount_applies_to === 'specific') {
      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShopId(body) {
    const { shopId, limit, page } = body;
    const discounts = await findDiscountCodesUnSelect({
      filter: {
        discount_shopId: convertStringToObjectId(shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      unSelect: ['__v', 'discount_shopId'],
      model: discount,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, order }) {
    const discountExists = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertStringToObjectId(shopId),
      },
    });
    if (!discountExists) {
      throw new NotFoundError('Discount not found');
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
      discount_product_ids,
      discount_start_date,
      discount_end_date,
      discount_applies_to,
      discount_users_used,
    } = discountExists;

    if (!discount_is_active) {
      throw new NotFoundError('Discount is not active');
    }
    if (!discount_max_uses) {
      throw new NotFoundError('Discount are out');
    }
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError('Discont is invalid');
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      if (discount_applies_to === TypeApply.ALL) {
        totalOrder = order.reduce((acc, product) => {
          return acc + product.quantity * product.price;
        }, 0);
      }

      if (discount_applies_to === TypeApply.SPECIFIC) {
        const productApplied = order.filter((product) =>
          discount_product_ids.includes(product.productId)
        );

        if (!productApplied.length) {
          throw new BadRequestError('Not product in order applied');
        }

        totalOrder = order.reduce((acc, product) => {
          if (discount_product_ids.includes(product.productId)) {
            return acc + product.quantity * product.price;
          }
          return acc;
        }, 0);
      }

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Discount requires a minium order value of ${discount_min_order_value}`
        );
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userUseDiscountCounter = discount_users_used.filter(
        (user) => user.userId === userId
      );

      if (userUseDiscountCounter.length === discount_max_uses_per_user) {
        throw new BadRequestError('You used discount');
      }
    }

    const amount =
      discount_type === DiscountType.FIXED_AMOUNT
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const discountExists = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertStringToObjectId(shopId),
      },
    });

    if (!discountExists) {
      throw new NotFoundError('Discount not found');
    }

    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertStringToObjectId(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const discountExists = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertStringToObjectId(shopId),
      },
    });

    if (!discountExists) {
      throw new NotFoundError('Discount not found');
    }

    const updated = await discount.findByIdAndUpdate(
      {
        _id: discountExists_id,
      },
      {
        $pull: {
          discount_users_used: userId,
        },
        $inc: {
          discount_uses_count: -1,
          discount_max_uses: 1,
        },
      }
    );
    return updated;
  }
}

module.exports = DiscountService;
