
const express = require('express');

const bcrypt = require('bcrypt');

const passport = require('passport');

const userRouter = express.Router();

const User = require('../models/User');
const alreadyLoggedIn = require('../utils/alreadyLoggedIn');
const isLogged = require('../utils/isLogged');

userRouter.post('/api/login', alreadyLoggedIn, passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    
    return res.status(200).redirect('/');
})

userRouter.post('/api/register', alreadyLoggedIn, async (req, res) => {

    let { email, password: plainPassword } = req.body;

    if(!email || !plainPassword){
        return res.redirect('/register');
    }

    let hashedPassword = await bcrypt.hash(plainPassword, 12);
    let user;

    try {
        user = new User({ email: email, password: hashedPassword });
        await user.save();
    } catch (e) {

        if (e.code == 11000) {
            return res.redirect('/register');
        }

        return res.status(200).json({ message: "something went wrong", error: e })
    }

    return res.status(200).redirect('/');
})

userRouter.post('/api/logout', isLogged, (req, res,) => {
    req.logout();
    return res.redirect('/');
})

module.exports = userRouter;