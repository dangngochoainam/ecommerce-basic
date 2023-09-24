const { SuccessResponse } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  reviewCheckout = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Review Checkout ok!!',
      statusCode: 201,
      metadata: await CheckoutService.reviewCheckout({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
