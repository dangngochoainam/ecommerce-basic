'use strict';

const { Schema, model } = require('mongoose');

const COLLECTION_NAME = 'Apikeys';
const DOCUMENT_NAME = 'Apikey';

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
