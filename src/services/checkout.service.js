const { BadRequestError } = require('../core/error.response');
const { order } = require('../models/order.model');
const { getCartById } = require('../models/repositories/cart.repo');
const {
  checkProductAvailableOnServer,
} = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');

class CheckoutService {
  // {
  //   "cartId": "64fc9df18260df8380379813",
  //   "shop_order_ids": [
  //     {
  //       "shopId": "64b2041c9907f2ffefaa362f",
  //       "shop_discounts": [
  //         {
  //           "shopId": "64b2041c9907f2ffefaa362f",
  //           "discountId": "64e21e4a9d96bce7d83c5fc3",
  //           "codeId": "SHOP-1122"
  //         }
  //       ],
  //       "item_products": [
  //         {
  //           "productId": "64bbadeac421d45e10f32e45",
  //           "quantity": 6,
  //           "price": 32355492
  //         },
  //         {
  //           "productId": "64c5c762492ff2146b190d38",
  //           "quantity": 3,
  //           "price": 3292
  //         }
  //       ]
  //     },
  //     {
  //       "shopId": "64b2984100d8323b74acb7f4",
  //       "shop_discounts": [],
  //       "item_products": [
  //         {
  //           "productId": "650fc8db654c6e1b21a8e89d",
  //           "quantity": 2,
  //           "price": 23
  //         }
  //       ]
  //     }
  //   ]
  // }

  static async reviewCheckout({ cartId, userId, shop_order_ids }) {
    const foundCart = getCartById({ cartId });
    if (!foundCart) {
      throw new BadRequestError('Cart not found');
    }

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      new_shop_order_ids = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // check product available
      const checkProductServer = await checkProductAvailableOnServer(
        item_products
      );
      if (!checkProductServer[0]) {
        throw new BadRequestError('Order Wrong !!!');
      }

      //Tong tien don hang của mot shop
      const checkoutPrice = checkProductServer.reduce((acc, item) => {
        return acc + item.quantity * item.price;
      }, 0);

      // Tong tien cua ca order trước khi discount
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, //tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //neu shop_discounts ton tai > 0, check xem co hop le khong
      if (shop_discounts.length > 0) {
        // gia su chi co mot discount
        // get amout discount
        for (let j = 0; j < shop_discounts.length; j++) {
          const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
            codeId: shop_discounts[j].codeId,
            userId,
            shopId,
            order: checkProductServer,
          });

          // Tong cong discount giam gia
          checkout_order.totalDiscount += discount;

          if (discount > 0) {
            itemCheckout.priceApplyDiscount = checkoutPrice - discount;
          }
        }
      }
      // Tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      new_shop_order_ids.push({ itemCheckout });
    }

    return {
      shop_order_ids,
      new_shop_order_ids,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { checkout_order, new_shop_order_ids } = await this.reviewCheckout({
      cartId,
      userId,
      shop_order_ids,
    });

    // check lai mot lan nua xem ton kho hay khong
    // get new array product
    const products = new_shop_order_ids.flatMap(
      (order) => order.itemCheckout.item_products
    );
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        'Mot so san pham da duoc cap nhat, vui long quay lai gio hang,...'
      );
    }

    const newOrder = order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: new_shop_order_ids,
    });

    if (newOrder) {
      // remove product in my cart
    }
    return newOrder;
  }

  // 1. Query Orders [User]
  static async GetOrdersByUser() {}

  // 1. Query One Orders [User]
  static async GetOneOrderByUser() {}

  // 1. Cancel Orders [User]
  static async cancelOrderByUser() {}

  // 1. Update Orders Status [Shop | Admin]
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
