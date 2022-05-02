const {Router} = require("express");
const { body } = require("express-validator");
const router = Router();
const Loan = require('../models/Loan');
const GhostUser = require('../models/GhostUser');

// /api/loans
router.get(
    '/all',
    async (req, res) => {
        try {
            const loan = await Loan.find({});
            
            
            
            res.json({loans: loan});
            
        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
        }
})

router.post(
    '/add',
    async (req, res) => {
        try{
            const result = await Loan.insertMany([...req.body]);
            if (!result || result.length === 0){throw new Error};
            res.json({message: 'займы добавлены'});
           
        }
        catch (e) {
                res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
            }
    }
)
router.post(
    '/addGhostUsers',
    async (req, res) => {
        try{
            const result = await GhostUser.insertMany([...req.body]);
            if (!result || result.length === 0){throw new Error};
            res.json({message: 'тени добавлены'});
           
        }
        catch (e) {
                res.status(500).json({message: 'добавление теней не прошло'});
            }
    }
)


module.exports = router;
