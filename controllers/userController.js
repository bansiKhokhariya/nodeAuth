const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const formidable = require('formidable');
const {sendWelcomeEmail} = require('../email/account')


const registerUser = asyncHandler(async (req, res, err) => {

    console.log(req.body);
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const userAvailable = await User.findOne({email});
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    //image resize //
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();

    //Hash password //
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profileImage: buffer
    });


    if (user) {
        sendWelcomeEmail(email, username)
        res.status(201).json({
            _id: user.id,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage
        });
    } else {
        res.status(400);
        throw new Error("User data us not valid");
    }

})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    _id: user.id
                }
            }, process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "2h"}
        );
        res.status(200).json({"message": "user login sucessfully!", "accessToken": accessToken});
    } else {
        res.status(401);
        throw new Error('email or password is not valid!')
    }
})

const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
})


const getImage = asyncHandler(async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.profileImage) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.profileImage)

    } catch (e) {
        res.status(404).send()
    }
})


module.exports = {registerUser, loginUser, currentUser, getImage};

