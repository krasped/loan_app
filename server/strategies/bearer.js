const BearerStrategy = require('passport-http-bearer').Strategy;
const passport = require('passport');
// const db = require('../db/models');


const jwt = require("jsonwebtoken");

const User = require('../models/User');

const findById = function(token, cb) {
    var decoded = jwt.verify(token, 'secret');
    process.nextTick(function() {
        db.User
        .findAll({ raw: true })
        .then((user) => {
            for(let i = 0; i < user.length; i++){
                if (user[i].id == decoded.data){
                    return cb(null, user[i]);  
                }
            }
            return cb(null, null);
        })
        .catch((err) => console.log(err));
    });
  }

passport.use(new BearerStrategy(
    function(token, cb) {
      findById(token, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        return cb(null, user);
      });
    }));


    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}//действителен 1 час
    )

    // исправить бирер стратегию для  моего проекта, поо идее осталось толкьо тут изменить.