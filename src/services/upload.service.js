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

  static async uploadFileFromLocal({ path, folderName = 'product/shopId' }) {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: 'local',
        folder: folderName,
      });
      console.log(result);
      return {
        image_url: result.secure_url,
        shopId: 'shopId',
        thumb_url: cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
        }),
      };
    } catch (error) {
      console.error('Error uploading :: ', error);
    }
  }
}

module.exports = UploadService;
