const express = require('express');
const MDFile = require('../models/MDFile');
const User = require('../models/User');
const isLogged = require('../utils/isLogged');
const isValidFileName = require('../utils/isValidFileName');
const filesRouter = express.Router();



filesRouter.get('/api/files', isLogged, async (req, res) => {
    let user = await User.findById(req.user._id).populate('files');

    return res.status(200).json({
        message: "Successfully got files",
        files: user.files
    })
})

filesRouter.post('/api/files', isLogged, async (req, res) => {

    let { name } = req.body;

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
            message: "You aren't authenticated to edit this file"
        })
    }

    return res.status(200).json(file);

})

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

    fileToEdit.name = name;
    await fileToEdit.save();

    return res.status(200).json({
        message: "Successfully edited file",
        editedFile: fileToEdit
    })

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

module.exports = filesRouter;