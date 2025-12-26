const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: duj6ln743,
  api_key: 725249261247451,
  api_secret: YpY9obV0IfSKPNKZ-Yrgpzgy2VE
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'meraki_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };