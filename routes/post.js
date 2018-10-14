const express = require('express')
const _ = require('lodash')
const Post = require('../models/post')

const router = express.Router()

router.get('/', (req, res) => {
    Post.find({})
        .then(posts => res.send(posts))
        .catch(err => res.status(400).send(err))
})

router.get('/:id', (req, res) => {
    var id = req.params.id
    Post.findById(id)
        .then(post => res.send(post))
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

router.patch('/:id', (req, res) => {
    var id = req.params.id
    var updatedBody = _.pick(req.body, ['title', 'body'])
    Post.findByIdAndUpdate(id, updatedBody, { new: true, runValidators: true })
        .then(post => res.send(post))
        .catch(err => res.status(400).send(err))
})

module.exports = router