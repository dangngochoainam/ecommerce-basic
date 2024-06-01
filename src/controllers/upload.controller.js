const { SuccessResponse } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class UploadController {
  uploadFile = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await UploadService.uploadFileFromUrl(),
    }).send(res);
  };
}

module.exports = new UploadController();
