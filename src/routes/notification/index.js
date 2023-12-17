const { authentication, authenticationV2 } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.use(authenticationV2);

router.get('', asyncHandler(notificationController.getListNotificationByUser));

module.exports = router;
