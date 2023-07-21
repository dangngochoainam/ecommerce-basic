'use strict';

const JWT = require('jsonwebtoken');
const { HEADER } = require('./constanst');
const { asyncHandler } = require('../helpers/asyncHandle');
const { NotFoundError, AuthFailureError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      // expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      // expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::${err}`);
      } else {
        console.log(`decode verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  // 1 - check missing userId
  // 2 - get accessToken
  // 3 - verify accessToken
  // 4 - check userId in db
  // 5 - check keyStore with this userid
  // 6 - ok all => return next()

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new NotFoundError('Not found userId');

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request');

  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (decode.userId != userId) throw new AuthFailureError('Invalid request');

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(error);
    throw new AuthFailureError('Invalid request');
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new NotFoundError('Not found userId');

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (refreshToken) {
    try {
      const decode = JWT.verify(refreshToken, keyStore.privateKey);
      if (decode.userId != userId)
        throw new AuthFailureError('Invalid request');

      req.keyStore = keyStore;
      req.user = decode;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      console.log(error);
      throw new AuthFailureError('Invalid request');
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request');
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (decode.userId != userId) throw new AuthFailureError('Invalid request');

    req.keyStore = keyStore;
    req.user = decode;
    return next();
  } catch (error) {
    console.log(error);
    throw new AuthFailureError('Invalid request');
  }
});

const verifyJWT = (token, keySecret) => JWT.verify(token, keySecret);

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};
