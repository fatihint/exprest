const express = require('express')
const { ObjectID } = require('mongodb')
const _ = require('lodash')
const User = require('../models/user')

const router = express.Router()

router.get('/', (req, res) => {
    User.find({}).then(users => res.send({users, status: 200}))
})

module.exports = router