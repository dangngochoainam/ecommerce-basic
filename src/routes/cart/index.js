const { authentication, authenticationV2 } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.use(authenticationV2);

router.post('', cartController.addToCart);
router.post('/update', cartController.update);
router.delete('', cartController.delete);
router.get('', cartController.listCart);

module.exports = router;
