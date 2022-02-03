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

app.post('/api/parsefile', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Invalid file type or file size too long",

        })
    }

    let parsedFile;

    try {
        parsedFile = matter.read(req.file.path);
    } catch (e) {

        await fs.promises.rm(req.file.path, { force: true });

        return res.status(400).json({
            message: "Couldn't parse the given file, something went wrong",
            error: e
        })
    }

    await fs.promises.rm(req.file.path, { force: true });

    return res.status(200).json(parsedFile);

})

app.get('/get')

app.listen(port, (e) => {
    console.log('Listening to port 8080')
})