const { inventory } = require('../inventory.model');

const insertInventory = async ({
  productId,
  productShop,
  stock,
  location = 'unKnow',
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_shopId: productShop,
    inven_stock: stock,
  });
};

module.exports = { insertInventory };
