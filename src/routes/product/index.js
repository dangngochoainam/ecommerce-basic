const { authentication } = require('../../auth/authUtils');
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.use(authentication);
router.post('', asyncHandler(ProductController.create));

module.exports = router;
