const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, path.join(__dirname, '..', 'uploads'));  
  },
  filename: (req, file, cb) => {
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);

    
    req.savedFilePath = `/app/uploads/${fileName}`;
  },
});

//only video and image fille allow
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
  limits: { fileSize: 50 * 1024 * 1024 }, //50 mb files size limit
});

module.exports = upload;


