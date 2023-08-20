'use strict';

const { getUnSelectData, getSelectData } = require('../../utils');

const findDiscountCodesUnSelect = async ({
  filter,
  limit = 50,
  sort = 'ctime',
  page = 1,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { createdOn: -1 } : { createdOn: 1 };
  const documets = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();
  return documets;
};

const findDiscountCodesSelect = async ({
  filter,
  limit = 50,
  sort = 'ctime',
  page = 1,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { createdOn: -1 } : { createdOn: 1 };
  const documets = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documets;
};

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

module.exports = { findDiscountCodesUnSelect, findDiscountCodesSelect, checkDiscountExists };
