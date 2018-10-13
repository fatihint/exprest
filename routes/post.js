const express = require('express')
const router = express.Router()

var posts = [
    {
        id: 1,
        title: 'bilmemne'
    },
    {
        id: 2,
        title: 'yeni'
    }
]

router.get('/', (req, res) => {
    res.send(posts)
})

router.post('/', (req, res) => {
    // var post = new Post()
})

module.exports = router