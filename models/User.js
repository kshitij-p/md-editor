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
        type: Array
        
    }

})

const User = new mongoose.model('User', userSchema);

module.exports = User;