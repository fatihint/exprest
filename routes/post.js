const express = require('express')
const _ = require('lodash')
const Post = require('../models/post')

const router = express.Router()

router.get('/', (req, res) => {
    Post.find({})
        .then(posts => res.send(posts))
        .catch(err => res.status(400).send(err))
})

router.post('/', (req, res) => {
    var body = _.pick(req.body, ['title', 'body'])
    var post = new Post({
        title: body.title,
        body: body.body
    })
    post.save()
        .then(post => res.send(post))
        .catch(err => res.status(400).send(err))
})

module.exports = router