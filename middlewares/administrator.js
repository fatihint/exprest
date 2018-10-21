const User = require('../models/user')

var administrator = (req, res, next) => {
    var user = req.user
    return user.isAdmin()
        .then()
        .catch(() => {
            res.status(401).send({
                status: 401,
                error: 'You are not allowed to see this.'
            })
        })

    next()
}

module.exports = { administrator }