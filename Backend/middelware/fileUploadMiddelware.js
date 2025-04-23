const multer = require('multer');
const fs = require('fs');
const constants = require("../src/constants/index")
const path = constants.IMAGE_PATH ? constants.IMAGE_PATH : "/src/public/uploads";

//donor file upload
const donorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path}/donorProfile`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const donorMulter = multer({ storage: donorStorage });

//user file upload
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path}/userProfile`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const userMulter = multer({ storage: userStorage });

const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path}/userProfile`);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
    req.savedFilename = filename; // Save the filename for later use
  },
});

const combinedMulter = multer({ storage: combinedStorage });

// Middleware to copy the file to donorProfile
const copyToDonorProfile = (req, res, next) => {
  const srcPath = `${path}/userProfile/${req.savedFilename}`;
  const destPath = `${path}/donorProfile/${req.savedFilename}`;

  fs.copyFile(srcPath, destPath, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

//event combined multer
const Eventstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      cb(null, `${path}/thumbnail`);
    } else if (file.fieldname === 'additionalThumbnail') {
      cb(null, `${path}/additionalThumbnail`);
    }
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/\s+/g, '');
    cb(null, Date.now() + '-' + sanitizedFileName);
  },
});

const Eventupload = multer({
  storage: Eventstorage 
});

//blog multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === 'authorProfile' ? `${path}/authorProfile` : `${path}/blogThumbnail`);
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/\s+/g, '');
    cb(null, Date.now() + '-' + sanitizedFileName);
  }
});

const upload = multer({
  storage: storage, fields: [
    { name: 'authorProfile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]
});

//news multer
const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === 'authorProfile' ? `${path}/authorProfile` : `${path}/newsThumbnail`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const newsUpload = multer({
  storage: newsStorage, fields: [
    { name: 'authorProfile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]
});


//Gallery file upload
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path}/gallery`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const galleryMulter = multer({ storage: galleryStorage });

// Hero file upload
const heroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path}/heroes`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const heroMulter = multer({ storage: heroStorage });

//sub-folder gallery
const competetionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path}/gallery/competetion`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const competetionMulter = multer({ storage: competetionStorage });

module.exports = {
  donorMulter,
  userMulter,
  Eventupload,
  newsUpload,
  upload,
  galleryMulter,
  combinedMulter,
  copyToDonorProfile,
  heroMulter,
  competetionMulter
};