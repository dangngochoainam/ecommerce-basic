'use strict';

const shopModel = require('../models/shop.model');
const bycrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  // LOGIN
  // 1 - check email
  // 2 - match password
  // 3 - create AT VS RT and save
  // 4 - genarate tokens
  // 5 - get data return login
  static login = async ({ email, password, refeshToken = null }) => {
    const shop = await findByEmail({ email });
    if (!shop) {
      throw new BadRequestError('Shop not registered');
    }

    const match = bycrypt.compare(password, shop.password);
    if (!match) throw new AuthFailureError('Authentication error');

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const tokens = await createTokenPair(
      { userId: shop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: shop._id,
    });

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: shop }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError('Error: Shop already registered !!');
    }

    const passHash = await bycrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('Error: keyStore error !!');
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log(`Created Token Success::`, tokens);

      return {
        shop: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newShop,
        }),
        tokens,
      };
    }

    return { code: 200, metadata: null };
  };
}

module.exports = AccessService;
