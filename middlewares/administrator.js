const User = require('../models/user')

var administrator = (req, res, next) => {    
    var token = req.headers['x-auth']

    return User.findByToken(token)
        .then(user => {
            if (user.role === 'ADMIN') {
                req.user = user
                req.token = token
                next()
            } else {
                res.status(401).send({
                    status: 401,
                    error: 'You are not ADMIN.'
                })
            }   
        })
        .catch(() => {
            res.status(401).send({
                status: 401,
                error: 'You are not authorized.'
            })
        })
}

module.exports = { administrator }