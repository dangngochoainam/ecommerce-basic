'use strict';

const { BadRequestError } = require('../core/error.response');
const {
  baseProduct,
  clothing,
  electronic,
} = require('../models/product.model');

class ProductFactory {
  static createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).createProduct();
      case 'Electronics':
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError('Invalid request :: ', type);
    }
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
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
  }

  async createProduct() {
    return await baseProduct.create(this);
  }
}

class Clothing extends BaseProduct {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('Create new Product error');
    return newProduct;
  }
}

class Electronics extends BaseProduct {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError('Create new Electronic error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('Create new Product error');
    return newProduct;
  }
}

module.exports = ProductFactory;
