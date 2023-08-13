'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (listSelect = []) => {
  return Object.fromEntries(listSelect.map((ele) => [ele, 1]));
};

const getUnSelectData = (listSelect = []) => {
  return Object.fromEntries(listSelect.map((ele) => [ele, 0]));
};

const removeNullOrUndefineValue = (obj) => {
  Object.keys(obj).forEach((item) => {
    if (obj[item] === null || obj[item] === undefined) delete obj[item];
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((item) => {
    if (typeof obj[item] === 'object' && !Array.isArray(obj[item])) {
      const response = updateNestedObjectParser(obj[item]);
      Object.keys(response).forEach((k) => {
        final[`${item}.${k}`] = response[k];
      });
    } else {
      final[`${item}`] = obj[item];
    }
  });
  return final;
};

const convertStringToObjectId = (id) => new Types.ObjectId(id);

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeNullOrUndefineValue,
  updateNestedObjectParser,
  convertStringToObjectId
};
