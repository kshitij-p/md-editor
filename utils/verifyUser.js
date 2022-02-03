const User = require('../models/User');
const bcrypt = require('bcrypt');

const verifyUser = async(email, password, done)=>{
    let user = await User.findOne({email: email});

    if(!user){
        return done(null, false, {message: "Invalid email"});
    }

    if(!await bcrypt.compare(password, user.password)){
        return done(null, false, {message: "Invalid password"});
    }

    return done(null, user, {message: "Successfully logged in"})
}

module.exports = verifyUser;