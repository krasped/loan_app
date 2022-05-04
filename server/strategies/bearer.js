const BearerStrategy = require("passport-http-bearer").Strategy;
const passport = require("passport");
// const db = require('../db/models');

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const findById = function (token, cb) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    process.nextTick(async function () {
        try {
            
            const condidate = await User.findById({
                _id: decoded.userId,
            });
            if (condidate && ( Math.floor(Date.now()/1000) - decoded.iat < 18000)) {//check token time created 5 h
                return cb(null, condidate);
            } else return cb(null, json('redirect'));
        } catch (e) {
            (err) => console.log('beare err'+err);
        }
    });
};

passport.use(
    new BearerStrategy(function (token, cb) {
        findById(token, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }),
);
