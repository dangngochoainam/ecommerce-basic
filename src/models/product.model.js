'use strict';

const { Schema, model } = require('mongoose');
const { ProductType } = require('../constanst/product.constants');
const { default: slugify } = require('slugify');

const COLLECTION_NAME = 'Products';
const DOCUMENT_NAME = 'Product';

const baseProductSchema = new Schema(
  {
    product_name: {
      type: String,
      require: true,
    },

    product_thumb: {
      type: String,
      require: true,
    },

    product_description: {
      type: String,
    },

    product_slug: {
      type: String,
    },

    product_price: {
      type: Number,
      require: true,
    },

    product_quantity: {
      type: Number,
      require: true,
    },

    product_type: {
      type: String,
      require: true,
      enum: Object.values(ProductType),
    },

    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },

    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },

    product_ratingsAverage: {
      type: Number,
      defauth: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be < 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },

    product_variations: {
      type: Array,
      default: [],
    },

    isDraft: { type: Boolean, default: true, index: true, select: false },

    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

// create index
baseProductSchema.index({ product_name: 'text', product_description: 'text' });

baseProductSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },

    size: String,

    material: String,

    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'Clothes',
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, require: true },

    model: String,

    color: String,

    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'Electronics',
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, require: true },

    size: String,

    material: String,

    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'Furniture',
    timestamps: true,
  }
);

module.exports = {
  baseProduct: model(DOCUMENT_NAME, baseProductSchema),
  electronic: model('Electronic', electronicSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema),
};
