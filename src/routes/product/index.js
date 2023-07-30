const { authentication, authenticationV2 } = require('../../auth/authUtils');
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.get('', asyncHandler(ProductController.getAllProduct));
router.get('/:id', asyncHandler(ProductController.getProductDetail));
router.get(
  '/search/:keySearch',
  asyncHandler(ProductController.getListProductSearch)
);
router.use(authenticationV2);
// POST
router.post('', asyncHandler(ProductController.create));
router.put(
  '/publish/:product_id',
  asyncHandler(ProductController.publishProductForShop)
);
router.put(
  '/unpublish/:product_id',
  asyncHandler(ProductController.unPublishProductForShop)
);

// QUERY
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop));
router.get(
  '/published/all',
  asyncHandler(ProductController.getAllPublishForShop)
);

module.exports = router;
