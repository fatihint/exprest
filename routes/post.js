const express = require('express')
const { ObjectID } = require('mongodb')
const _ = require('lodash')
const Post = require('../models/post')

const router = express.Router()

const { authenticate } = require('../middlewares/authenticate')

router.get('/', authenticate, (req, res) => {
    req.query.owner = req.user._id
    Post.find(req.query)
        .then(posts => res.send({ posts, status: 200 }))
        .catch(err => res.status(400).send(err))
})

router.delete('/', authenticate, (req, res) => {
    var query = _.pick(req.query, ['title'])

    Post.findOneAndRemove({ title: query.title })
        .then((post) => {
            if (!post) {
                return res.status(404).send()
            }
            res.send(post)
        })
        .catch(err => res.status(400).send(err))
})

router.get('/:id', authenticate, (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Post.findOne({
        owner: req.user._id,
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

router.post('/', authenticate, (req, res) => {
    var body = _.pick(req.body, ['title', 'body'])
    
    var post = new Post({
        owner: new ObjectID(req.user._id),
        title: body.title,
        body: body.body
    })
    post.save()
        .then(post => res.send(post))
        .catch(err => res.status(400).send(err))
})

router.patch('/:id', authenticate, (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    var updatedBody = _.pick(req.body, ['title', 'body'])
    updatedBody.updatedAt = Date.now()

    Post.findOneAndUpdate({ _id: id }, updatedBody, { new: true, runValidators: true })
        .then((post) => {
            if (!post) {
                return res.status(404).send()
            }
            res.send(post)
        })
        .catch(err => res.status(400).send(err))
})

router.delete('/:id', authenticate, (req, res) => {
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