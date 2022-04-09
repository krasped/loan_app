const {Router} = require("express");
const router = Router();

// /api/auth
router.post('/register', async (req, res) => {
    try {

    } catch (e) {

    }
})


router.get('/login', async (req, res) => {
    console.log('hello');
})
// const getAuthor = function (req, res) {
//     db.Author
//         .findAll({ raw: true })
//         .then((author) => {
//             res.json(author);
//         })
//         .catch((err) => console.log(err));
// };

// router.get("/", getAuthor);

module.exports = router;
