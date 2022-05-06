const express = require("express");
const cors = require("cors");
const passport = require('passport');
// const cookieParser = require("cookie-parser");
const app = express();
require('./strategies/bearer.js')


const auth = require('./routes/auth');
const users = require('./routes/users');
const loans = require('./routes/loans');
const add_loan = require('./routes/add_loan');
app.use(cors());
app.use(express.json());
// app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth',auth);
app.use('/users',passport.authenticate('bearer', {failureRedirect: '/auth', session: false, failureMessage: true }),users);
app.use('/loans',passport.authenticate('bearer', {failureRedirect: '/auth', session: false, failureMessage: true }),loans);
app.use('/add_loan',passport.authenticate('bearer', {failureRedirect: '/auth', session: false, failureMessage: true }),add_loan);
app.use('*', (req, res) => res.status(404).json({error:"not found"}));

// app.use("/", mainRouter);
// app.use("/user",passport.authenticate('bearer', {failureRedirect: '/login', session: false, failureMessage: true }), authRouter);


module.exports = app;