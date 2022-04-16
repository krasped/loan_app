const {Router} = require("express");
const router = Router();
const User = require('../models/User');

// /api/users
router.get(
    '/all',
    async (req, res) => {
        try {
            const user = await User.find({},{password:0},{contacts:0});
            
            
            
            res.json({users: user})
            
        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
        }
})

router.get(
    '/loan',
    async (req, res) => {
        try {
            const user = await User.find({},{password:0},{contacts:0});
            
            
            
            res.json({users: user})
            
        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
        }
    }
)

router.post(
    '/addContact',
    async (req, res) => {
        try {
        
            res.json({users: user})
            
        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
        }
})

router.post(
    '/removeContact',
    async (req, res) => {
        try {
        
            res.json({users: user})
            
        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
        }
})


// router.post(
//     '/login',
//     [
//         body('password').isLength({min:6})
//     ],
//     async (req, res) => {
//         try {
//             //validation
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({ 
//                     errors: errors.array(),
//                     message: 'некоректрые данные при логине'
//                 });
//               }
//             //check unique
//             const {login, password} = req.body;
//             const user = await User.findOne({ login });
//             if(!user) {
//                 return res.status(400).json({message: 'пользователь не найден'});
//             }
            
//             const isMatch = await bcrypt.compare(password, user.password);

//             if (!isMatch){
//                 return res.status(400).json({message: 'ошибка при логине'})
//             }

//             const token = jwt.sign(
//                 { userId: user.id },
//                 process.env.JWT_SECRET,
//                 {expiresIn: '1h'}//действителен 1 час
//             )
            
//             res.json({token, userId: user.id})
//         } catch (e) {
//             res.status(500).json({message: 'что-то пошло не так попробуйте снова'});
//         }
// })

// router.get("/", getAuthor);

module.exports = router;
