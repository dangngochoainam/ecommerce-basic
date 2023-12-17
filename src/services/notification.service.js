const { BadRequestError, NotFoundError } = require('../core/error.response');
const { Notification, notification } = require('../models/notification.model');
const { convertStringToObjectId } = require('../utils');

class NotificationService {
  static async pushNotiToSystem({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {},
  }) {
    let noti_content;

    switch (type) {
      case 'SHOP-001':
        noti_content = `@@@ vừa mới thêm một sản phẩm: @@@@`;
        break;
      case 'PROMOTION-001':
        noti_content = `@@@ vừa mới thêm một voucher: @@@@`;
        break;
    }

    const newNoti = await notification.create({
      noti_type: type,
      noti_receivedId: receivedId,
      noti_senderId: senderId,
      noti_content,
      noti_options: options,
    });

    return newNoti;
  }

  static async listNotifitionByUser({ type = 'ALL', userId = 1, isRead = 0 }) {
    const match = { noti_receivedId: userId };
    if (type !== 'ALL') {
      match['noti_type'] = type;
    }

    return await notification.aggregate([
      {
        $match: match,
      },
    ]);
  }
}

module.exports = NotificationService;
