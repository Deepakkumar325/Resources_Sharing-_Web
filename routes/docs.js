require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const connectToDatabase = async () => {
    return new Promise((resolve, reject) => {
        const conn = mongoose.createConnection(process.env.URI2, { useUnifiedTopology: true, useNewUrlParser: true });

        conn.once('open', () => {
            const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'resource'
            });
            resolve(gfs);
        });

        conn.on('error', (error) => {
            reject(error);
        });
    });
};

// Use async function to wait for the connection to open
const initializeGridFS = async () => {
    try {
        const gfs = await connectToDatabase();
        return gfs;
    } catch (error) {
        console.error('Error initializing GridFS:', error.message);
        throw error;
    }
};

// Initialize gfs once
let gfsPromise = initializeGridFS();

router.get('/:docname', async (req, res) => {
    try {
        // Wait for the gfs to be initialized
        const gfs = await gfsPromise;

        const file = await gfs
            .find({
                filename: req.params.docname
            })
            .toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "no files exist"
            });
        }

        const myfile = file[0];

        gfs.openDownloadStreamByName(req.params.docname).pipe(res);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
