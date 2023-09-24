const { StateCart } = require('../../constanst/cart.constants');
const { convertStringToObjectId } = require('../../utils');
const { cart } = require('../cart.model');

const getCartById = async ({ cartId }) => {
  return await cart
    .findOne({
      _id: convertStringToObjectId(cartId),
      cart_state: StateCart.ACTIVE,
    })
    .lean();
};

module.exports = { getCartById };
