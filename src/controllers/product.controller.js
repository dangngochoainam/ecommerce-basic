const { SuccessResponse } = require('../core/success.response');
const ProductFactory = require('../services/product.service');
const ProductFactoryV2 = require('../services/product.service.lvXX');

class ProductController {
  // create = async (req, res, next) => {
  //   return new SuccessResponse({
  //     message: 'Create product successfully',
  //     metadata: await ProductFactory.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userId,
  //     }),
  //   }).send(res);
  // };

  create = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Create product successfully',
      metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
