const mongoose = require('../db/mongoose')
const _ = require('lodash')

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

UserSchema.methods.toJSON = function() {
    var userObj = this.toObject()
    return _.pick(userObj, ["_id", "email", "createdAt"])
}

var User = mongoose.model('User', UserSchema)

module.exports = User