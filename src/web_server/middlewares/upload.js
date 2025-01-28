const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads';
    if (file.fieldname === 'video') {
      folder = 'uploads/videos';
    } else if (file.fieldname === 'image') {
      folder = 'uploads/images';
    } else if (file.fieldname === 'poster') {
      folder = 'uploads/posters';
    }

    const folderPath = path.join(__dirname, '..', folder);

    // Check if folder exists and create it if necessary
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);

    // Save file paths 
    if (file.fieldname === 'video') {
      req.savedVideoPath = `${fileName}`;
    } else if (file.fieldname === 'image') {
      req.savedImagePath = `${fileName}`;
    } else if (file.fieldname === 'poster') {
      req.savedPosterPath = `${fileName}`;
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  const allowedTypes = [...allowedVideoTypes, ...allowedImageTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video and image files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
});

module.exports = upload;
