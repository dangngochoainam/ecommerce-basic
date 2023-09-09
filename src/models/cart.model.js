const { Schema, model } = require('mongoose');
const { StateCart } = require('../constanst/cart.constants');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      require: true,
      enum: Object.values(StateCart),
      default: StateCart.ACTIVE,
    },
    cart_products: {
      type: Array,
      require: true,
      default: [],
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
