const express = require('express');
const MDFile = require('../models/MDFile');
const User = require('../models/User');
const isLogged = require('../utils/isLogged');
const isValidFileName = require('../utils/isValidFileName');

const filesRouter = express.Router();
const matter = require('gray-matter');
const { fileBucket, bucketName } = require('../utils/fileBucket');

filesRouter.get('/api/files', isLogged, async (req, res) => {
    let user = await User.findById(req.user._id).populate('files');

    return res.status(200).json({
        message: "Successfully got files",
        files: user.files
    })
})

filesRouter.post('/api/files', isLogged, async (req, res) => {

    let { name, fileData } = req.body;

    if (!name) {
        return res.status(400).json({
            message: `Missing 'name' in request body`
        })
    }

    if (!isValidFileName(name)) {
        return res.status(400).json({
            message: "Invalid file name - file name cannot contain certain characters"
        })
    }

    let newFile;

    try {

        newFile = new MDFile({ name: name, author: req.user._id });
        await newFile.save();

        let filePath = `userfiles/${req.user._id.toString()}/${name}.md`;

        await fileBucket.putObject({ Bucket: bucketName, Key: filePath, Body: fileData || '' }).promise();


    } catch (e) {

        if (e.code == 11000) {
            return res.status(400).json({
                message: "No duplicate file names allowed"
            })
        }

        return res.status(500).json({ message: "Couldnt create file", error: e });
    }

    return res.status(200).json({
        message: "Successfully created file",
        createdFile: newFile
    })
})

filesRouter.get('/api/files/:id', isLogged, async (req, res) => {

    let { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Missing id in request url params",
            exampleRequest: '/api/files/1123idhere'
        })
    }

    let file = await MDFile.findById(id);

    if (!file) {
        return res.status(400).json({ message: "No such file exists" })
    }

    if (!req.user._id.equals(file.author)) {
        return res.status(400).json({
            message: "You aren't authenticated to view this file"
        })
    }

    return res.status(200).json({ message: "Successfully retrieved file", file: file });

})

/* Renames files */
filesRouter.put('/api/files/:id', isLogged, async (req, res) => {

    let { id } = req.params;
    let { name } = req.body;

    if (!id || !name) {
        return res.status(200).json({
            message: `Missing ${id ? 'name' : 'id'} in ${id ? 'request body' : 'request url params'}`,
            exampleRequest: '/api/files/1123idhere and \'name\' in request body'
        });
    }

    if (!isValidFileName(name)) {
        return res.status(400).json({
            message: "Invalid file name - file name cannot contain certain characters"
        })
    }

    let fileToEdit = await MDFile.findById(id);

    if (!fileToEdit) {
        return res.status(400).json({
            message: "No such file exists"
        })
    }

    if (!req.user._id.equals(fileToEdit.author)) {
        return res.status(400).json({
            message: "You aren't authenticated to edit this file"
        })
    }

    try {

        fileToEdit.name = name;
        await fileToEdit.save();
    } catch (e) {
        if (e.code == 11000) {
            return res.status(400).json({
                message: "No duplicate file names allowed"
            })
        }

        return res.status(500).json({ message: "Couldnt create file", error: e });
    }

    return res.status(200).json({
        message: "Successfully edited file",
        editedFile: fileToEdit
    })

})
/* ^ Renames files ^ */

/* Saves file */
filesRouter.patch('/api/files/:id', isLogged, async (req, res) => {

    let { id } = req.params;
    let { fileData } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Missing id in request url params",
            exampleRequest: '/api/files/1123idhere'
        })
    }

    /* We check for undefined here as user may want to make his file empty which would trigger !fileData */
    if (fileData === undefined) {
        return res.status(400).json({ message: "Missing fileData in request body" });
    }

    let file = await MDFile.findById(id);

    if (!file) {
        return res.status(400).json({ message: "No such file exists" });
    }

    if (!req.user._id.equals(file.author)) {
        return res.status(400).json({ message: "You aren't authenticated to do that" });
    }

    try {

        await fileBucket.putObject({ Body: fileData, Key: file.path, Bucket: bucketName }).promise()

    } catch (e) {

        return res.status(400).json({ message: "Coulnd't save", error: e })
    }

    await file.save();

    return res.status(200).json({ message: "Successfully saved file with the given contents " })
})

filesRouter.delete('/api/files/:id', isLogged, async (req, res) => {

    let { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Missing id in request url params",
            exampleRequest: '/api/files/1123idhere'
        })
    }

    let file = await MDFile.findById(id);

    if (!file) {
        return res.status(400).json({
            message: "No such file exists"
        })
    }

    if (!req.user._id.equals(file.author)) {
        return res.status(400).json({ message: "You aren't authenticated to edit this file" })
    }

    await file.remove();

    return res.status(200).json({
        message: "Successfully deleted the requested file",
        deletedFile: id
    })

})

filesRouter.post('/api/files/:id/parse', isLogged, async (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Missing id in request url params",
            exampleRequest: '/api/files/1123idhere'
        })
    }

    let file = await MDFile.findById(id);

    if (!file) {
        return res.status(400).json({ message: "No such file exists" });
    }

    if (!req.user._id.equals(file.author)) {
        return res.status(400).json({ message: "You are not authenticated to view this file" });
    }

    let parsedFile, toParse;

    try {

        let awsFile = await fileBucket.getObject({ Bucket: bucketName, Key: file.path }).promise();
        toParse = awsFile.Body.toString('utf8');

    } catch (e) {
        return res.status(500).json({ message: "Error while retrieving from AWS", e })
    }

    try {

        parsedFile = matter(toParse);

    } catch (e) {
        return res.status(500).json({ message: "Couldnt parse the requested file", error: e });
    }

    return res.status(200).json({ message: "Successfully parsed the requested file", requestedFile: file, parsedFile: parsedFile })

})



module.exports = filesRouter;