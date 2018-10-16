const express = require('express')
const { ObjectID } = require('mongodb')
const _ = require('lodash')
const User = require('../models/user')

const router = express.Router()

router.get('/', (req, res) => {
    User.find(req.query)
        .then(users => res.send({ users, status: 200 }))
        .catch(err => res.status(400).send(err))
})

router.get('/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    User.findOne({
        _id: id
    })
        .then((user) => {
            if (!user) {
                res.status(404).send()
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

module.exports = router