'use strict';

const { findById } = require('../services/apikey.service');
const { HEADER } = require('./constanst');

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'permission denied' });
    }

    console.log('permission::', req.objKey.permissions);
    const isValidPermission = req.objKey.permissions.includes(permission);
    if (!isValidPermission) {
      return res.status(403).json({ message: 'permission denied' });
    }
    return next();
  };
};

module.exports = { apiKey, permission };
