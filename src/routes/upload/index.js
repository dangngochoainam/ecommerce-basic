// const { authentication, authenticationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../configs/config.multer');
const UploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

// router.use(authenticationV2);

router.post('/product', asyncHandler(UploadController.uploadFile));
router.post(
  '/product/local',
  uploadDisk.single('file'),
  asyncHandler(UploadController.uploadFileFromLocal)
);

module.exports = router;
