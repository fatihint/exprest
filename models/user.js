const mongoose = require('../db/mongoose')
const _ = require('lodash')
const validator = require('validator')
const bcrypt = require('bcrypt')

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

UserSchema.pre('save', function(next) {
    const user = this
    
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            }) 
        })
    } else {
        next()
    }
})

var User = mongoose.model('User', UserSchema)

module.exports = User