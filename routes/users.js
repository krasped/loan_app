const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const Loan = require("../models/Loan");

// /api/users
router.get("/all", async (req, res) => {
    try {
        const user = await User.find({}, { password: 0 }, { contacts: 0 });
        res.json({ users: user });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});
router.get("/all/login", async (req, res) => {
    try {
        const user = await User.find({},{login: 1});
        res.json({ users: user });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});

router.post("/contacts", async (req, res) => {
    try {
        const { _id } = req.body;
        const user = await User.findById({ _id }, "contacts").populate(
            "contacts",
            ["login", "firstName", "phone"],
        );
        res.json({ users: user });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});

router.post("/loans", async (req, res) => {
    try {
        const { login } = req.body;
        const loan = await Loan.find({ login });
        console.log(req.body.login);
        res.json({ loans: loan });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});

router.post("/addContact", async (req, res) => {
    try {
        const { _id, contactId } = req.body;
        const user = await User.findById({ _id });
        user.contacts.push(contactId);
        await user.save();
        res.json({ message: "контакт добавлен" });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});

router.post("/removeContact", async (req, res) => {
    try {
        const { _id, contactId } = req.body;
        const user = await User.findById({ _id });
        console.log(user);
        const result = user.contacts.filter(
            (item) => item.toString() !== contactId,
        );
        user.contacts = result;
        await user.save();
        res.json({ message: "контакт удален" });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});

module.exports = router;
