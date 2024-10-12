'use strict';

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

// implement rol_grants
// const grantList = [
//   {
//     role: 'admin',
//     resource: 'profile',
//     action: 'update:any',
//     attributes: '*',
//   },
//   {
//     role: 'admin',
//     resource: 'balance',
//     action: 'update:any',
//     attributes: '*, !mount',
//   },

//   {
//     role: 'shop',
//     resource: 'profile',
//     action: 'update:own',
//     attributes: '*',
//   },
//   {
//     role: 'shop',
//     resource: 'balance',
//     action: 'update:own',
//     attributes: '*',
//   },

//   {
//     role: 'user',
//     resource: 'profile',
//     action: 'update:own',
//     attributes: '*',
//   },
//   {
//     role: 'user',
//     resource: 'balance',
//     action: 'read:own',
//     attributes: '*',
//   },
// ];

const roleSchema = new Schema(
  {
    rol_name: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'shop'],
    },
    rol_slug: {
      type: String,
      require: true,
    },
    rol_status: {
      type: String,
      require: true,
    },
    rol_description: {
      type: String,
      default: '',
    },
    rol_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: 'Resource',
          require: true,
        },
        actions: [{ type: String, require: true }],
        attributes: { type: String, default: '*' },
      },
    ],
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, roleSchema);
