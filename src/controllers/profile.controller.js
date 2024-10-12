const { SuccessResponse } = require('../core/success.response');
const InventoryService = require('../services/inventory.service');

const profileData = [
  {
    usr_id: 1,
    usr_name: 'CR7',
    usr_avt: 'image1',
  },
  {
    usr_id: 2,
    usr_name: 'M10',
    usr_avt: 'image11',
  },
  {
    usr_id: 3,
    usr_name: 'Nam',
    usr_avt: 'image',
  },
];

class ProfileController {
  profile = async (req, res, next) => {
    return new SuccessResponse({
      message: 'profile one view',
      statusCode: 200,
      metadata: profileData[2],
    }).send(res);
  };

  profiles = async (req, res, next) => {
    return new SuccessResponse({
      message: 'view all profile',
      statusCode: 200,
      metadata: profileData,
    }).send(res);
  };
}

module.exports = new ProfileController();
