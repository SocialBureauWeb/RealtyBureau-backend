const express = require("express");
const upload = require("../middlewares/cloudinary");
const uploadRoutes = express.Router();

// Upload single image
uploadRoutes.post('/image', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      res.json({
        success: true,
        data: {
          url: req.file.path,
          filename: req.file.filename
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// Upload multiple images
uploadRoutes.post('/images', (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
    
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }
      
      const urls = req.files.map(file => ({
        url: file.path,
        filename: file.filename
      }));
      
      res.json({
        success: true,
        data: urls
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// Upload video
uploadRoutes.post('/video', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      res.json({
        success: true,
        data: {
          url: req.file.path,
          filename: req.file.filename
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

module.exports = uploadRoutes;
