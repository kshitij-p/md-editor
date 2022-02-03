
const express = require('express');

const bcrypt = require('bcrypt');

const passport = require('passport');

const userRouter = express.Router();

const User = require('../models/User');

userRouter.post('/api/login', passport.authenticate('local', { failureRedirect: '/fail' }), (req, res) => {
    return res.status(200).json(req.user);
})

userRouter.post('/api/register', async (req, res) => {

    let { email, password: plainPassword } = req.body;

    let hashedPassword = await bcrypt.hash(plainPassword, 12);
    let user;

    try {
        user = new User({ email: email, password: hashedPassword });
        await user.save();
    } catch (e) {

        if(e.code == 11000 && e.index === 0){
            return res.redirect('/register');
        }

        return res.status(200).json({ message: "something went wrong", error: e })
    }

    return res.status(200).json({
        message: "Successfully registered",
        user: user
    });
})

module.exports = userRouter;