const { convertStringToObjectId } = require('../../utils');
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

const resevationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: convertStringToObjectId(productId),
    inven_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservations: {
        quantity,
        cardId,
        createOn: new Date(),
      },
    },
  };

  const options = {
    upsert: true,
    new: true,
  };

  return await inventory.updateOne(query, updateSet, options);
};

module.exports = { insertInventory, resevationInventory };
