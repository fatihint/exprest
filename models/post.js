const _ = require('lodash')
const mongoose = require('../db/mongoose')

var PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 80
    },
    body: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 320
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

PostSchema.methods.toJSON = function() {
    var postObject = this.toObject()
    return _.pick(postObject, ['_id', 'title', 'body', 'createdAt'])
}

var Post = mongoose.model('Post', PostSchema)

module.exports = Post