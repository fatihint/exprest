const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')
const Post = require('../../models/post')

const userOneID = new ObjectID()
const userTwoID = new ObjectID()

const users = [
    {
        _id: userOneID,
        email: 'testuser1@gmail.com',
        password: 'password1',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneID, access: 'auth' }, 'secretkey')
        }]
    },
    {
        _id: userTwoID,
        email: 'testuser2@hotmail.com',
        password: 'password2',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoID, access: 'auth' }, 'secretkey')
        }],
        role: 'ADMIN'
    }
]

const posts = [
    {
        owner: userOneID,
        _id: new ObjectID(),
        title: 'Test Title 1',
        body: 'Test body 1'
    },
    {
        owner: userOneID,
        _id: new ObjectID(),
        title: 'Test Title 3',
        body: 'Test body 3'
    },
    {
        owner: userTwoID,
        _id: new ObjectID(),
        title: 'Test Title 2',
        body: 'Test body 2'
    }
]

var populateUsers = (done) => {
    User.remove({})
        .then(() => {
            var userOne = new User(users[0]).save()
            var userTwo = new User(users[1]).save()

            return Promise.all([userOne, userTwo])
        })
        .then(() => done())
        .catch(err => { throw err})
}

var populatePosts = (done) => {
    Post.remove({})
        .then(() => {
           return Post.insertMany(posts)
        })
        .then(() => done())
        .catch(err => { throw err })
}

module.exports = { posts, users, populatePosts, populateUsers }