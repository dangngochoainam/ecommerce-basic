const { authentication, authenticationV2 } = require('../../auth/authUtils');
const InventoryController = require('../../controllers/inventory.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');

const router = require('express').Router();

router.use(authenticationV2);

router.post('', asyncHandler(InventoryController.addStockToInventory));

module.exports = router;
