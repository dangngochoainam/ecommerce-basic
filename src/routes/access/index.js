const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// check authentication
router.use(authenticationV2);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post(
  '/shop/refreshToken',
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
