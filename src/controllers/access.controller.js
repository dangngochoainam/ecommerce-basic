'use strict';

const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  login = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Login successfully',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    return new CREATED({
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
