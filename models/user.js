const mongoose = require('../db/mongoose')
const _ = require('lodash')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function () {
    var userObj = this.toObject()
    return _.pick(userObj, ["_id", "email", "createdAt", "updatedAt"])
}

UserSchema.methods.generateAuthToken = function () {
    var access = 'auth'
    var token = jwt.sign({ _id: this._id, access }, 'secretkey')
    this.tokens.push({ access, token })

    return this.save().then(() => {
        return token
    })
}

UserSchema.statics.findByToken = function(token) {
    var decoded

    try {
        decoded = jwt.decode(token, 'secretkey')
    } catch (error) {
        return Promise.reject()
    }

    if (!decoded) {
        decoded = ''
    }
    return this.findOne({ 
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': decoded.access,
    }).then(user => {
        if (user) {
            return Promise.resolve(user)
        }
        return Promise.reject()
    }).catch(err => {
        return Promise.reject()
    })
}

UserSchema.statics.login = function (email, password) {
    return this.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                }
                reject()
            })
        })
    })
}

UserSchema.pre('save', function (next) {
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