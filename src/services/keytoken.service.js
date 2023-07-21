const keytokenModel = require('../models/keyToken.model');
const {
  Types: { ObjectId },
} = require('mongoose');
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: new ObjectId(userId) },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new ObjectId(userId) });
  };

  static deleteKeyStoreById = async (_id) => {
    return await keytokenModel.deleteOne({ _id: new ObjectId(_id) });
  };

  static deleteKeyStoreByUserId = async (userId) => {
    return await keytokenModel.deleteMany({ user: new ObjectId(userId) });
  };

  static findByRefreshTokenUsed = async (refreshToken) =>
    await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();

  static findByRefreshToken = async (refreshToken) =>
    await keytokenModel.findOne({ refreshToken });
}

module.exports = KeyTokenService;
