const { SuccessResponse } = require('../core/success.response');
const InventoryService = require('../services/inventory.service');

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    return new SuccessResponse({
      message: 'addStockToInventory ok!!',
      statusCode: 201,
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
