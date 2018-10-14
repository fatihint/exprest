const express = require('express')
const { ObjectID } = require('mongodb')
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

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Post.findOne({
        _id: id
    })
        .then((post) => {
            if (!post) {
                return res.status(404).send()
            }
            res.send(post)
        })
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

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    var updatedBody = _.pick(req.body, ['title', 'body'])

    Post.findOneAndUpdate({ _id: id }, updatedBody, { new: true, runValidators: true })
        .then((post) => {
            if (!post) {
                return res.status(404).send()
            }
            res.send(post)
        })
        .catch(err => res.status(400).send(err))
})

router.delete('/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Post.findOneAndRemove({ _id: id })
        .then((post) => {
            if (!post) {
                return res.status(404).send()
            }
            res.send(post)
        })
        .catch(err => res.send(err))
})

module.exports = router