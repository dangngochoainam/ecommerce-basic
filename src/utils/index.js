'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (listSelect = []) => {
  return Object.fromEntries(listSelect.map((ele) => [ele, 1]));
};

const getUnSelectData = (listSelect = []) => {
  return Object.fromEntries(listSelect.map((ele) => [ele, 0]));
};

module.exports = { getInfoData, getSelectData, getUnSelectData };
