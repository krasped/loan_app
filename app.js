const express = require("express");
const cors = require("cors");
const passport = require("passport");
// const cookieParser = require("cookie-parser");
const app = express();
require("./strategies/bearer.js");

const auth = require("./routes/auth");
const users = require("./routes/users");
const loans = require("./routes/loans");
const add_loan = require("./routes/add_loan");

const isRedirect = (req,res,next) => {
    console.log(req,res)
    next();
}

app.use(cors());
app.use(express.json());
// app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", auth);
app.use(
    "/users",
    passport.authenticate("bearer", {
    session: false,
    failureRedirect: "/auth/failure",
    }),
    users
);
app.use(
    "/loans",
    passport.authenticate("bearer", {
        failureRedirect: "/auth/failure",
        session: false,
    }),
    loans,
);
app.use(
    "/add_loan",
    passport.authenticate("bearer", {
        failureRedirect: "/auth/failure",
        session: false,
    }),
    add_loan,
);
//for heroku
app.use(express.static("client/build"));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client", "build", "index.html"));
});


module.exports = app;
