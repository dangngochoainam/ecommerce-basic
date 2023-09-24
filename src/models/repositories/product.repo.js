'use strict';

const { Types } = require('mongoose');
const {
  baseProduct,
  clothing,
  electronic,
  furniture,
} = require('../product.model');
const {
  getSelectData,
  getUnSelectData,
  convertStringToObjectId,
} = require('../../utils');

const queryProduct = async ({ query, limit, skip }) => {
  return await baseProduct
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllPublishForProduct = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await baseProduct.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await baseProduct.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const searchProduct = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await baseProduct
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return results;
};

const findAllProduct = async ({ filter, limit, sort, page, select }) => {
  const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
  const skip = (page - 1) * limit;
  const results = await baseProduct
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .select(getSelectData(select))
    .lean();

  return results;
};

const findProductDetail = async ({ product_id, select }) => {
  const results = await baseProduct
    .findById(product_id)
    .select(getUnSelectData(select))
    .lean();

  return results;
};

const findProductById = async ({ product_id }) => {
  return await baseProduct.findById(product_id).lean();
};

const findByIdAndUpdate = async ({
  productId,
  productShop,
  model,
  bodyUpdate,
  isNew = true,
}) => {
  const result = await model.findOneAndUpdate(
    {
      _id: productId,
      product_shop: productShop,
    },
    bodyUpdate,
    {
      new: isNew,
      returnDocument: 'after',
    }
  );

  return result;
};

const checkProductAvailableOnServer = async (products) => {
  return Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductById({
        product_id: product.productId,
      });
      if (foundProduct && foundProduct.product_quantity > product.quantity) {
        return {
          ...product,
          price: foundProduct.product_price,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForProduct,
  unPublishProductByShop,
  searchProduct,
  findAllProduct,
  findProductDetail,
  findByIdAndUpdate,
  findProductById,
  checkProductAvailableOnServer,
};
