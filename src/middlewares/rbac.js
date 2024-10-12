'use strict';

const { AuthFailureError } = require('../core/error.response');
const rbac = require('./role.middleware');

const grantAccess = (action, resource) => (req, res, next) => {
  try {
    const rol_name = req.query.role;
    const permission = rbac.can(rol_name)[action](resource);
    if (!permission.granted) {
      throw new AuthFailureError('Permission denied');
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = grantAccess;
