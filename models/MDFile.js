const mongoose = require('mongoose');
const path = require('path');
const User = require('./User');
const fs = require('fs');
const { fileBucket, bucketName } = require('../utils/fileBucket');

const mdFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    path: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    lastModified: {
        type: Date,
        default: Date.now,

    }
})

/* Removes document from the authors files array and deletes it from the public dir */
mdFileSchema.pre('remove', async function (next) {

    try {

        await fileBucket.deleteObject({ Bucket: bucketName, Key: this.path }).promise()

        let author = await User.findById(this.author);

        let newFiles = author.files.filter((x) => {
            if (!this._id.equals(x)) {
                return x;
            }
        });

        author.files = newFiles;
        await author.save();

    } catch (e) {
        console.log('error while deleting', e);
    }


    return next();
})

/* Renames file if exists or creates if it doesnt, in the user's public files directory */
mdFileSchema.pre('save', async function (next) {

    let oldPath = this.path;

    let filePath = `${this.author._id.toString()}/${this.name}.md`;

    this.path = filePath;
    this.lastModified = Date.now();

    /* Check if it exists in the author */

    let author = await User.findById(this.author);

    if (!author.files.length) {

        author.files = [...author.files, this._id];
        await author.save();

    } else {
        if (!author.files.includes(this._id)) {

            author.files = [...author.files, this._id];
            await author.save();
        }

    }

    /* Renames  */
    if (oldPath && oldPath !== filePath) {
        let file;

        /* Check AWS S3 if our file exists or not */
        try {

            file = await fileBucket.headObject({ Bucket: bucketName, Key: oldPath }).promise()
        } catch (e) {
            if (e.code !== 'NotFound') {
                console.log('error while finding', e);
                return next();
            }
            file = null;
        }

        if (file) {

            try {
                await fileBucket.copyObject({ Bucket: bucketName, Key: filePath, CopySource: `/${bucketName}/${oldPath}` }).promise();
                await fileBucket.deleteObject({ Bucket: bucketName, Key: oldPath }).promise();
            } catch (e) {
                console.log('error while renaming', e);
            }
        }
    }

    return next();

})

const MDFile = mongoose.model('MDFile', mdFileSchema);

module.exports = MDFile;