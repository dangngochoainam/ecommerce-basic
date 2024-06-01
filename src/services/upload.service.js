const cloudinary = require('../configs/config.cloudinary');

class UploadService {
  static async uploadFileFromUrl() {
    try {
      const urlImage =
        'https://media.vov.vn/sites/default/files/styles/large/public/2024-06/roo.jpg';
      const folderName = 'product/shopId';
      const newFileName = 'testdemo';
      const result = await cloudinary.uploader.upload(urlImage, {
        // public_id: newFileName,
        folder: folderName,
      });
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error uploading :: ', error);
    }
  }
}

module.exports = UploadService;
