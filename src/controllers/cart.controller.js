const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
  addToCart = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Create new cart successfully',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    return new SuccessResponse({
      message: 'update cart successfully',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    return new SuccessResponse({
      message: 'delete cart successfully',
      metadata: await CartService.deleteCartItem(req.body),
    }).send(res);
  };

  listCart = async (req, res, next) => {
    return new SuccessResponse({
      message: 'list cart',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
