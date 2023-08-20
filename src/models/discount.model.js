const { Schema, model } = require('mongoose');
const { TypeApply, DiscountType } = require('../constanst/discount.constants');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema(
  {
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_code: { type: String, require: true },
    discount_type: { type: String, default: DiscountType.FIXED_AMOUNT },
    discount_value: { type: Number, require: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_uses: { type: Number, require: true }, // so lượng discount được sử dụng
    discount_uses_count: { type: Number, require: true }, // so lượng discount đã sử dụng
    discount_users_used: { type: Array, default: [] }, // ai đã sử dụng
    discount_max_uses_per_user: { type: Number, require: true }, // so lượng cho phép toi da 1 người có thể sử dụng discount này
    discount_min_order_value: { type: Number, require: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      require: true,
      enum: [TypeApply.ALL, TypeApply.SPECIFIC],
    },
    discount_product_ids: { type: Array, default: [] }, // so san pham được áp dụng
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
