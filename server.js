const express = require('express');
const matter = require('gray-matter')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let port = process.env.PORT || 8080;

app.get('/blah', (req, res)=>{
    res.send('meow');
})

app.post('/api/parsefile', upload.single('file'), async(req, res) => {
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

app.listen(port, (e) => {
    console.log('Listening to port 8080')
})