const BearerStrategy = require("passport-http-bearer").Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const findById = function (token, cb) {
    process.nextTick(async function () {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const condidate = await User.findById({
                _id: decoded.userId,
            });
            if (
                condidate &&
                Math.floor(Date.now() / 1000) - decoded.iat < 18000
            ) {
                //check token time created 5 h
                return cb(null, condidate);
            } else return cb(null, false);
        } catch (e) {
            return cb(e);
        }
    });
};

passport.use(
    new BearerStrategy(function (token, cb) {
        findById(token, function (err, user) {
            if (err || !user) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }),
);
