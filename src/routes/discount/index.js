const { authenticationV2 } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get(
  '/list-product-code',
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);
router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCode));

module.exports = router;
