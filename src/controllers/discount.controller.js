const { SuccessResponse } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Discount created!!',
      statusCode: 201,
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getAllDiscountCode = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get All Discount - getAllDiscountCodesByShopId!!',
      statusCode: 200,
      metadata: await DiscountService.getAllDiscountCodesByShopId({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get Discount Amount - getDiscountAmount!!',
      statusCode: 200,
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get All Discount - getAllDiscountCodesWithProduct!!',
      statusCode: 201,
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
