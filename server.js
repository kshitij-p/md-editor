const express = require('express');
const matter = require('gray-matter')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const verifyUser = require('./utils/verifyUser');

const mongoose = require('mongoose');
const User = require('./models/User');
const MDFile = require('./models/MDFile')
const isLogged = require('./utils/isLogged');
const getUserFiles = require('./utils/getUserFiles');

const userRouter = require('./routers/userRouter');


const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, 'public', 'tmp'),
    filename: (req, file, cb) => {

        let slug = file.originalname.split('.');
        let ext = slug.pop();

        slug = slug.join('.');

        let newName = slug + Date.now().toString() + '.' + ext;

        cb(null, newName);
    }
})

const upload = multer({
    storage: diskStorage, fileFilter: (req, file, cb) => {
        let ext = file.originalname.split('.').pop().toLowerCase();

        if (ext === 'md' || ext === 'txt') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
})


let port = process.env.PORT || 8080;

const app = express();


app.use(session({
    secret: process.env.SESSION_SECRET || 'sometotallysecuresecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

/* Init passport */

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({ usernameField: 'email' }, verifyUser))

passport.serializeUser(async (user, done) => {

    return done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    return done(null, user);
})

/* ^ Init passport ^ */

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/mdeditor').then(() => {
    console.log('Mongoose connected')
}).catch((e) => {
    console.log("Couldn't conenct to mongodb", e);
})

app.use(userRouter);

app.get('/api/me', isLogged, async (req, res) => {
    let user = await User.findById(req.user._id).populate('files');

    return res.status(200).json(user);
})

app.get('/api/files', isLogged, async (req, res) => {
    let user = await User.findById(req.user._id).populate('files');

    return res.status(200).json({
        message: "Successfully got files",
        files: user.files
    })
})

app.post('/api/files', isLogged, async (req, res) => {

    let { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: `Missing 'name' in request body`
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

app.get('/api/files/:id', isLogged, async (req, res) => {

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

app.put('/api/files/:id', isLogged, async (req, res) => {

    let { id } = req.params;
    let { name } = req.body;

    if (!id || !name) {
        return res.status(200).json({
            message: `Missing ${id ? 'name' : 'id'} in ${id ? 'request body' : 'request url params'}`,
            exampleRequest: '/api/files/1123idhere and \'name\' in request body'
        });
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

app.delete('/api/files/:id', isLogged, async (req, res) => {

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


app.post('/api/parsefile', upload.single('file'), async (req, res) => {



    /* If uploading files, uploadingFile header must be added to the request */
    let isUploading = req.headers['uploading-file'].toLowerCase() === 'true';

    console.log({ isUploading });

    if (isUploading) {

        if (!req.file) {
            return res.status(400).json({
                message: "File missing or invalid file type or file size too big",

            })
        }
    } else {
        if (!req.body.path) {
            return res.status(400).json({
                message: "File path missing",

            })
        }
    }

    let parsedFile;

    try {

        if (isUploading) {

            parsedFile = matter.read(req.file.path);

        } else {
            parsedFile = matter.read(req.body.path);
        }

    } catch (e) {

        if (isUploading) {

            await fs.promises.rm(req.file.path, { force: true });
        }

        return res.status(400).json({
            message: "Couldn't parse the given file, something went wrong",
            error: e
        })
    }

    if (isUploading) {

        await fs.promises.rm(req.file.path, { force: true });

    }

    return res.status(200).json(parsedFile);

})


app.listen(port, (e) => {
    console.log('Listening to port 8080')
})