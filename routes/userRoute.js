const express = require('express');
const router = express.Router();
const {loginUser, registerUser, currentUser, getImage} = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');
const multer = require("multer");


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image'))
        }
        return cb(undefined, true);
    }
})

router.route('/login').post(loginUser);
router.post('/register', upload.single('profileImage'), registerUser);
router.get('/currentUser', validateToken, currentUser);
router.get('/getImage/:id', getImage);


module.exports = router;