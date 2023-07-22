'use strict';

const { Schema, model } = require('mongoose');
const { ProductType } = require('../constanst/product.constants');

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
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

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
