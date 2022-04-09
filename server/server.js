const express = require("express");
const cors = require("cors");
const auth = require('./routes/auth')
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',auth);
app.use('*', (req, res) => res.status(404).json({error:"not found"}));

// app.use("/", mainRouter);
// app.use("/user",passport.authenticate('bearer', {failureRedirect: '/login', session: false, failureMessage: true }), authRouter);


module.exports = app;