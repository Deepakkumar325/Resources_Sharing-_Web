require('dotenv').config();

const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

var storage = new GridFsStorage({
  url: process.env.URI2,
  options: {
    useUnifiedTopology: true,
  },
  file: (req, file) => {
    console.log("Inside the single upload");
    console.log(req.body);

    return new Promise(async (resolve, reject) => {
      try {
        crypto.randomBytes(16, (err, buf) => {
          console.log("Inside the upload function");
          if (err) {
            console.log(err);
            return reject(err);
          }

          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'resource',
          };
          resolve(fileInfo);
        });
      } catch (error) {
        console.error('Error during file upload:', error);
        reject(error); // Reject with the error to pass it to the next middleware
      }
    });
  },
});

const upload = multer({ storage });

module.exports = upload;
