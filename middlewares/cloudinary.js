const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Missing Cloudinary env vars. Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: isVideo ? 'realty-videos' : 'realty-images',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo ? ['mp4', 'webm', 'ogg', 'mov'] : ['jpeg', 'png', 'jpg', 'webp'],
    };
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const allowedVideos = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const allowed = [...allowedImages, ...allowedVideos];
    
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG/PNG/WEBP images and MP4/WEBM/OGG/MOV videos are allowed'), false);
    }
    cb(null, true);
  },
  limits: { 
    fileSize: 100 * 1024 * 1024 // 100MB for videos
  },
});

module.exports = upload;