const express = require('express')
const { ObjectID } = require('mongodb')
const _ = require('lodash')

const User = require('../models/user')
const { administrator } = require('../middlewares/administrator')
const { authenticate } = require('../middlewares/authenticate')

const router = express.Router()

router.get('/', administrator, (req, res) => {
    User.find(req.query)
        .then(users => res.send({ users, status: 200 }))
        .catch(err => res.status(400).send(err))
})

router.get('/:id', administrator, (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    User.findOne({
        _id: id
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send()
            }
            res.send(user)
        })
        .catch(err => res.status(400).send(err))
})

router.post('/', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User({
        email: body.email,
        password: body.password
    })
    user.save()
        .then(user => res.send(user))
        .catch(err => res.status(400).send(err))
})

router.patch('/:id', authenticate, (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    var updatedBody = _.pick(req.body, ['email', 'password'])
    updatedBody.updatedAt = Date.now()

    if (req.user.role === 'USER' && id != req.user._id) {
            return res.status(401).send()
    }

    User.findOneAndUpdate({ _id: id }, updatedBody, { new: true, runValidators: true })
        .then((user) => {
            if (!user) {
                return res.status(404).send()
            }
            res.send(user)
        })
        .catch(err => res.status(400).send(err))
})

router.delete('/:id', authenticate, (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    if (req.user.role === 'USER' && id != req.user._id) {
        return res.status(401).send()
    }

    User.findOneAndRemove({ _id: id })
        .then((user) => {
            if (!user) {
                return res.status(404).send()
            }
            res.send(user)
        })
        .catch(err => res.send(err))
})

router.post('/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password'])

    if (body.email && body.password) {
        User.login(body.email, body.password)
            .then((user) => {
                return user.generateAuthToken()
                    .then(token => {
                        res.header('x-auth', token).send({
                            status: 200,
                            token
                        })
                    })
            })
            .catch((err) => {
                res.status(404).send({
                    status: 404,
                    error: 'Wrong email or password !',
                })
            })
    } else {
        res.status(400).send({
            status: 400,
            error: 'Credentials are missing.'
        })
    }
})

router.get('/me', authenticate, (req, res) => {
    User.findOne({
        _id: req.user._id
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send()
            }
            res.send(user)
        })
        .catch(err => res.status(400).send(err))
})

module.exports = router