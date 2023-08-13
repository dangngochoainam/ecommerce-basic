'use strict';

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
      new Date() < new Date(start_date) ||
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
      new Date() < new Date(start_date) ||
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

    if (!discountExists || !discountExists.is_active) {
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
}

module.exports = DiscountService;
