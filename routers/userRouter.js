
const express = require('express');

const bcrypt = require('bcrypt');

const passport = require('passport');

const userRouter = express.Router();

const User = require('../models/User');
const alreadyLoggedIn = require('../utils/alreadyLoggedIn');
const isLogged = require('../utils/isLogged');

userRouter.post('/api/login', alreadyLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send(401, { message: info.message, loggedIn: false });
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send({ loggedIn: true, message: 'Successfully logged in' });
        });
    })(req, res, next)
}
)

userRouter.post('/api/register', alreadyLoggedIn, async (req, res) => {

    let { email, password: plainPassword } = req.body;

    if (!email || !plainPassword) {
        return res.status(400).json({ message: "Missing email or password", success: false });
    }

    let hashedPassword = await bcrypt.hash(plainPassword, 12);
    let user;

    try {
        user = new User({ email: email, password: hashedPassword });
        await user.save();
    } catch (e) {

        if (e.code == 11000) {
            return res.status(200).json({ message: "Email already exists", success: false });
        }

        return res.status(200).json({ message: "Something went wrong", success: false });
    }

    return res.status(200).json({ message: "Successfully reigstered", success: true });
})

userRouter.post('/api/logout', isLogged, (req, res,) => {
    req.logout();
    return res.redirect('/');
})

module.exports = userRouter;