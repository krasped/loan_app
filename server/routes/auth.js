const {Router} = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
// /api/auth
router.post(
    '/register', 
    [
        body('password').isLength({min:6}),
        body('phone').isNumeric()
    ],
    async (req, res) => {
        try {
            //validation
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    errors: errors.array(),
                    message: 'некоректрые данные при регистрации'
                });
              }
            //check unique
            
            const {login, firstName, phone, password} = req.body;
            const candidate = await User.findOne({$or: [{phone}, {login}]});
            if(candidate) {
                return res.status(400).json({message: 'такой пользователь существует'})
            }
            
            const hashedPassword = await bcrypt.hash(password, 13);
            const user = new User({login, firstName, phone, password: hashedPassword});
            await user.save();
            res.status(201).json({message: 'пользователь создан'});
        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
        }
})


router.post(
    '/login',
    [
        body('password').isLength({min:6})
    ],
    async (req, res) => {
        try {
            //validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    errors: errors.array(),
                    message: 'некоректрые данные при логине'
                });
              }
            //check unique
            const {login, password} = req.body;
            const user = await User.findOne({ login });
            if(!user) {
                return res.status(400).json({message: 'пользователь не найден'});
            }
            
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch){
                return res.status(400).json({message: 'ошибка при логине'})
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                {expiresIn: '1h'}//действителен 1 час
            )
            
            res.json({token, userId: user.id})
        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
        }
})

// router.get("/", getAuthor);

module.exports = router;
