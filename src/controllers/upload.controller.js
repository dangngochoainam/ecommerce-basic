const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class UploadController {
  uploadFile = async (req, res, next) => {
    return new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await UploadService.uploadFileFromUrl(),
    }).send(res);
  };

  uploadFileFromLocal = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('file missing');
    }
    return new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await UploadService.uploadFileFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
