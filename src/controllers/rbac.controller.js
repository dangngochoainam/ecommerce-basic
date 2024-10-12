'use strict';

const { SuccessResponse } = require('../core/success.response');
const rbacService = require('../services/rbac.service');

const createRole = async (req, res, next) => {
  return new SuccessResponse({
    message: 'Create new role successfully',
    metadata: await rbacService.createRole(req.body),
  }).send(res);
};

const listRole = async (req, res, next) => {
  return new SuccessResponse({
    message: 'List role successfully',
    metadata: await rbacService.listRole(req.query),
  }).send(res);
};

const createResource = async (req, res, next) => {
  return new SuccessResponse({
    message: 'Create new resource successfully',
    metadata: await rbacService.createResource(req.body),
  }).send(res);
};

const listResource = async (req, res, next) => {
  return new SuccessResponse({
    message: 'List resource successfully',
    metadata: await rbacService.listResource(req.query),
  }).send(res);
};

module.exports = {
  createRole,
  listRole,
  createResource,
  listResource,
};
