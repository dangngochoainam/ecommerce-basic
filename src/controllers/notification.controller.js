const { SuccessResponse } = require('../core/success.response');
const NotificationService = require('../services/notification.service');

class NotificationController {
  getListNotificationByUser = async (req, res, next) => {
    return new SuccessResponse({
      message: 'get notification ok!!',
      statusCode: 201,
      metadata: await NotificationService.listNotifitionByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
