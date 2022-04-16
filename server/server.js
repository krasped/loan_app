const express = require("express");
const cors = require("cors");
const auth = require('./routes/auth');
const users = require('./routes/users');
const loans = require('./routes/loans');
const add_loan = require('./routes/add_loan');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth',auth);
app.use('/users',users);
app.use('/loans',loans);
app.use('/add_loan',add_loan);
app.use('*', (req, res) => res.status(404).json({error:"not found"}));

// app.use("/", mainRouter);
// app.use("/user",passport.authenticate('bearer', {failureRedirect: '/login', session: false, failureMessage: true }), authRouter);


module.exports = app;