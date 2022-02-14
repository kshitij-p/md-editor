const mongoose = require('mongoose');
const defaultUserPrefs = require('./defaultUserPrefs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    files: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MDFile' }]

    },
    preferences: {
        type: Object,
        default: defaultUserPrefs
    }

})

const User = new mongoose.model('User', userSchema);

module.exports = User;