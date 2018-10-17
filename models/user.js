const mongoose = require('../db/mongoose')
const _ = require('lodash')
const validator = require('validator')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Password is required.'],
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            msg: 'Please send a valid email address.'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        trim: true,
        minlength: [6, 'Password must be minimum 6 characters !']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

UserSchema.methods.toJSON = function() {
    var userObj = this.toObject()
    return _.pick(userObj, ["_id", "email", "createdAt", "updatedAt"])
}

var User = mongoose.model('User', UserSchema)

module.exports = User