'use strict';
const { StateCart } = require('../constanst/cart.constants');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { cart } = require('../models/cart.model');
const { findProductById } = require('../models/repositories/product.repo');
const { convertStringToObjectId } = require('../utils');

class CartService {
  static async createUserCart({ userId, product }) {
    const query = {
      cart_userId: userId,
      cart_state: StateCart.ACTIVE,
    };

    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };

    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;

    const query = {
      cart_userId: userId,
      cart_state: StateCart.ACTIVE,
      'cart_products.productId': productId,
    };

    const update = {
      $inc: {
        'cart_products.$.quantity': quantity,
      },
    };

    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, update, options);
  }

  static async addToCart({ userId, product = {} }) {
    // check cart ton tai hay khong ?
    const userCart = await cart.findOne({
      cart_userId: userId,
    });

    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    // neu co gio hang roi nhung chua co sp
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // gio hang ton tai, va co sp nay trong cart
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const product = await findProductById({ product_id: productId });
    if (!product) {
      throw new NotFoundError('product not found');
    }

    if (product.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('product do not belong to the shop');
    }

    if (quantity === 0) {
      // delete PRODUCT
      await CartService.deleteCartItem({ userId, productId });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteCartItem({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: StateCart.ACTIVE };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;
