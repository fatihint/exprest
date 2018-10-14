const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/exprest', { useNewUrlParser: true })

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function () {
    console.log('Connected')
})

var Post = mongoose.model('Post', {
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

module.exports = Post