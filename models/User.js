const mongoose = require('mongoose');

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
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'MDFile'}]

    }

})

const User = new mongoose.model('User', userSchema);

module.exports = User;