'use strict';

const { Types } = require('mongoose');
const { ProductType } = require('../constanst/product.constants');
const { BadRequestError } = require('../core/error.response');
const {
  baseProduct,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const {
  findAllDraftsForShop,
  publishProductByShop,
  getAllPublishForProduct,
  findAllPublishForProduct,
  unPublishProductByShop,
  searchProduct,
  findAllProduct,
  findProductDetail,
  findByIdAndUpdate,
} = require('../models/repositories/product.repo');
const {
  removeNullOrUndefineValue,
  updateNestedObjectParser,
} = require('../utils');
const { insertInventory } = require('../models/repositories/inventory.repo');

class ProductFactory {
  static productRegisterd = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegisterd[type] = classRef;
  }

  static createProduct(type, payload) {
    const productClass = ProductFactory.productRegisterd[type];

    if (!productClass) throw new BadRequestError('Invalid request :: ', type);

    return new productClass(payload).createProduct();
  }

  static updateProduct(type, productId, productShop, payload) {
    const productClass = ProductFactory.productRegisterd[type];

    if (!productClass) throw new BadRequestError('Invalid request :: ', type);

    return new productClass({
      ...payload,
      product_id: new Types.ObjectId(productId),
      product_shop: new Types.ObjectId(productShop),
    }).updateProduct(new Types.ObjectId(productId));
  }

  /**
   *
   * @desc Get all draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @param {String} product_shop
   * @return {JSON}
   */
  static async getAllDraftForProduct({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async getAllPublishForProduct({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForProduct({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async searchProducts({ keySearch }) {
    return await searchProduct({ keySearch });
  }

  static async getAllProduct({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter = { isPublished: true },
    select = ['product_name', '_id', 'product_price'],
  }) {
    return await findAllProduct({ filter, limit, sort, page, select });
  }

  static async getProductDetail({ product_id, select = ['__v'] }) {
    return await findProductDetail({ product_id, select });
  }
}

class BaseProduct {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
    product_ratingsAverage,
    product_slug,
    product_variations,
    isDraft,
    isPublished,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
    this.product_slug = product_slug;
    this.product_variations = product_variations;
    this.product_ratingsAverage = product_ratingsAverage;
    this.isDraft = isDraft;
    this.isPublished = isPublished;
  }

  async createProduct(productId) {
    const newProduct = await baseProduct.create({ ...this, _id: productId });

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        productShop: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  async updateProduct(productId, bodyUpdate, productShop) {
    return await findByIdAndUpdate({
      productId,
      productShop: productShop,
      model: baseProduct,
      bodyUpdate: bodyUpdate,
    });
  }
}

class Clothing extends BaseProduct {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create new Product error');
    return newProduct;
  }
}

class Electronics extends BaseProduct {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError('Create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new Product error');
    return newProduct;
  }
}

class Furniture extends BaseProduct {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create new Product error');
    return newProduct;
  }

  async updateProduct(productId) {
    const bodyUpdate = this;

    if (bodyUpdate.product_attributes) {
      await findByIdAndUpdate({
        productId,
        productShop: this.product_shop,
        model: furniture,
        bodyUpdate: removeNullOrUndefineValue(bodyUpdate.product_attributes),
      });
    }

    const baseProductUpdate = await super.updateProduct(
      productId,
      updateNestedObjectParser(removeNullOrUndefineValue(bodyUpdate)),
      this.product_shop
    );

    return baseProductUpdate;
  }
}

ProductFactory.registerProductType(ProductType.Clothing, Clothing);
ProductFactory.registerProductType(ProductType.Electronics, Electronics);
ProductFactory.registerProductType(ProductType.Furniture, Furniture);

module.exports = ProductFactory;
