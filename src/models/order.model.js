const { Schema, model } = require('mongoose');
const { StatusOrder } = require('../constanst/order.constants');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderSchema = new Schema(
  {
    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },
    order_trackingNumber: { type: String, default: ['#000118052022'] },
    order_status: {
      type: String,
      enum: StatusOrder,
      default: StatusOrder.PENDING,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  order: model(DOCUMENT_NAME, orderSchema),
};
