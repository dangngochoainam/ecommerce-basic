const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// 'ORDER-001': order successfully,
//  'ORDER-OO2': order faield,
// 'PROMOTION-001': new Promotion,
// 'SHOP-001': new product by user following



const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ['ORDER-001', 'ORDER-OO2', 'PROMOTION-001', 'SHOP-001'],
      require: true,
    },
    noti_senderId: { type: Schema.Types.ObjectId, ref: 'Product' },
    noti_receivedId: { type: Number, require: true },
    noti_content: { type: String, require: true },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  notification: model(DOCUMENT_NAME, notificationSchema),
};
