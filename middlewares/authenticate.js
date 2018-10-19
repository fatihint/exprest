const User = require('../models/user')

var authenticate = (req, res, next) => {    
    var token = req.headers['x-auth']

    return User.findByToken(token)
        .then(user => {
            req.user = user
            req.token = token
            next()
        })
        .catch(() => {
            res.status(401).send({
                status: 401,
                error: 'You are not authorized.'
            })
        })
}

module.exports = { authenticate }