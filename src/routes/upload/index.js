// const { authentication, authenticationV2 } = require('../../auth/authUtils');
const UploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

// router.use(authenticationV2);

router.post('/product', asyncHandler(UploadController.uploadFile));

module.exports = router;
