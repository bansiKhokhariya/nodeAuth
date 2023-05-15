const mongoose = require('mongoose');
const buffer = require("buffer");

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: [true, 'please add the user name']
        },
        email: {
            type: String,
            required: [true, 'please add the user email'],
            unique: [true, "Email address already taken"],
        },
        password: {
            type: String,
            required: [true, 'please add the user password']
        },
        profileImage: {
           type : Buffer
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema);
