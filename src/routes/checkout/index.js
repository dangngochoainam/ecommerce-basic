const { authentication, authenticationV2 } = require('../../auth/authUtils');
const checkoutController = require('../../controllers/checkout.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.use(authenticationV2);

router.post('/review', checkoutController.reviewCheckout);

module.exports = router;
