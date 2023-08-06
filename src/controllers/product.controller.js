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

  update = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Update product successfully',
      metadata: await ProductFactoryV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        req.user.userId,
        req.body
      ),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list draft product successfully',
      metadata: await ProductFactoryV2.getAllDraftForProduct({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list publish product successfully',
      metadata: await ProductFactoryV2.getAllPublishForProduct({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Publish product successfully',
      metadata: await ProductFactoryV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  unPublishProductForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Unpublish product successfully',
      metadata: await ProductFactoryV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  getListProductSearch = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list product successfully',
      metadata: await ProductFactoryV2.searchProducts(req.params),
    }).send(res);
  };

  getAllProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get list product successfully',
      metadata: await ProductFactoryV2.getAllProduct(req.query),
    }).send(res);
  };

  getProductDetail = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Get product detail successfully',
      metadata: await ProductFactoryV2.getProductDetail({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
