const { BadRequestError } = require('../core/error.response');
const { inventory } = require('../models/inventory.model');
const { findProductById } = require('../models/repositories/product.repo');

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '123, Tran Phu, HCM city',
  }) {
    const product = await findProductById(productId);

    if (!product) throw new BadRequestError('The product does not exists');

    const query = {
      inven_shopId: shopId,
      inven_productId: productId,
    };

    const updateSet = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };

    const options = {
      upsert: true,
      new: true,
    };

    return await inventory.findByIdAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
