const mongoose = require('../db/mongoose')
const _ = require('lodash')

var PostSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
        trim: true,
        minlength: [2, 'Title must be minimum 2 characters !'],
        maxlength: [80, 'Title can\'t be longer than 80 characters !']
    },
    body: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Body must be minimum 2 characters !'],
        maxlength: [320, 'Body can\'t be longer than 320 characters !']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

PostSchema.methods.toJSON = function () {
    var postObject = this.toObject()
    return _.pick(postObject, ['_id', 'title', 'body', 'createdAt', 'updatedAt'])
}

var Post = mongoose.model('Post', PostSchema)

module.exports = Post