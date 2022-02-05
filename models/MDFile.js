const mongoose = require('mongoose');
const path = require('path');
const getUserFiles = require('../utils/getUserFiles');
const User = require('./User');
const fs = require('fs');

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
        let author = await User.findById(this.author);

        let newFiles = author.files.filter((x) => {
            if (!this._id.equals(x)) {
                return x;
            }
        });

        author.files = newFiles;
        await author.save();

    } catch (e) {
        console.log(e);

    }

    try {
        await fs.promises.rm(this.path, { force: true });

    } catch (e) {
        console.log('error while deleting', e);
    }


    return next();
})

/* Renames file if exists or creates if it doesnt, in the user's public files directory */
mdFileSchema.pre('save', async function (next) {

    let oldPath = this.path;

    let filePath = path.join(process.cwd(), 'public', 'userfiles', this.author._id.toString(), this.name + '.md')

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

    /* Check if directory for the user exists first */
    let files = await getUserFiles(this.author._id.toString());

    /* Updates */
    if (oldPath) {
        if (files.includes(path.basename(oldPath))) {

            try {

                await fs.promises.rename(oldPath, filePath);

            } catch (e) {
                console.log('error while renaming', e);
            }
            return next();
        } else {

            /* Creates if no file to update */
            try {
                await fs.promises.writeFile(filePath, '', { flag: 'wx' });
            } catch (e) {
                if (e.errno != -4075 && e.code !== 'EEXIST') {

                    console.log('error while creating', e);
                }
            }

            next();
        }
    }

})

const MDFile = mongoose.model('MDFile', mdFileSchema);

module.exports = MDFile;