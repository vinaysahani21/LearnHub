const multer = require('multer');
const path = require('path');

// 🔥 CHANGED: We now use memoryStorage instead of diskStorage
const storage = multer.memoryStorage();

// Accept Images OR Videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mkv|mov/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only Images (jpeg, jpg, png) and Videos (mp4, mkv) are allowed!'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 }, // 100MB limit (Adjust if needed)
  fileFilter: fileFilter
});

module.exports = upload;