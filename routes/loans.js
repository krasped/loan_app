const { Router } = require("express");
const router = Router();
const Loan = require("../models/Loan");
const User = require("../models/User");

// /api/loans
router.get("/all", async (req, res) => {
    try {
        const loan = await Loan.find({});

        res.json({ loans: loan });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});


router.post("/my", async (req, res) => {
    try {
        const {_id} = req.body;
        const user = await User.findById({_id});
        const loan = await Loan.find({'login': user.login})
        res.json({ loans: loan });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});



router.get("/remove", async (req, res) => {
    try {
        const loan = await Loan.find({});

        res.json({ loans: loan });
    } catch (e) {
        res.status(500).json({
            message: "что-то пошло не так попробуйте снова",
        });
    }
});


module.exports = router;
