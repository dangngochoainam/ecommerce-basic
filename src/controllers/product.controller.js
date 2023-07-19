const { SuccessResponse } = require('../core/success.response');
const ProductFactory = require('../services/product.service');

class ProductController {
  create = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Create product successfully',
      metadata: await ProductFactory.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
