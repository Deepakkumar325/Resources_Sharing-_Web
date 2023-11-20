
const mongoose = require('mongoose');
// const { mongoURI1, mongoURI2 } = require('../config');
const Grid = require('gridfs-stream');
const router = require('../routes/docs');
const conn = mongoose.createConnection(process.env.URI2, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


let gfs;


conn.once('open', () => {

  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'profileDocs'
  });
});

function deleteFile(id) {
  const obj_id = new mongoose.Types.ObjectId(id);
  gfs.delete(obj_id);
}
module.exports = deleteFile;