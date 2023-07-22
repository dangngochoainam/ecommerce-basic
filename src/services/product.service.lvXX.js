'use strict';

const { ProductType } = require('../constanst/product.constants');
const { BadRequestError } = require('../core/error.response');
const {
  baseProduct,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');

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

  async createProduct(productId) {
    return await baseProduct.create({ ...this, _id: productId });
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
}

ProductFactory.registerProductType(ProductType.Clothing, Clothing);
ProductFactory.registerProductType(ProductType.Electronics, Electronics);
ProductFactory.registerProductType(ProductType.Furniture, Furniture);

module.exports = ProductFactory;
