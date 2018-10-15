const mongoose = require('../db/mongoose')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

var User = mongoose.model('User', UserSchema)

module.exports = User