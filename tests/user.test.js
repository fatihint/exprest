const expect = require('expect.js')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const User = require('../models/user')
const { app } = require('../server.js')

const userOneID = new ObjectID().toHexString()
const userTwoID = new ObjectID().toHexString()

const users = [
    {
        _id: userOneID,
        email: 'testuser1@gmail.com',
        password: 'password1'
    },
    {
        _id: userTwoID,
        email: 'testuser2@hotmail.com',
        password: 'password2'
    }
]

beforeEach(function () {
    users.forEach(user => {
        var userDoc = new User(user)
        userDoc.save().then().catch()
    })
})

afterEach(function() {
    users.forEach(user => {
        User.findOneAndRemove({
            _id: user._id
        }).then().catch()
    })
})

describe('USER', () => {

    describe('GET /users', () => {
        it('should get all users', (done) => {
            request(app)
                .get('/users')
                .expect(200)
                .expect((res) => {
                    expect(res.status).to.be(200)
                })
                .end((err, res) => {
                    if (err) throw err
                    done()
                })
        })
    })

    describe('GET /users/:id', () => {
        it('should get the user with given id', (done) => {
            request(app)
                .get(`/users/${userOneID}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.email).to.equal(users[0].email)
                })
                .end((err, res) => {
                    if (err) throw err
                    done()
                })
        })

        it('should return 404 when id is invalid', (done) => {
            request(app)
                .get('/users/invalidid')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err
                    done()
                })
        })

        it('should return 404 when user with :id doesn\'t exists', (done) => {
            request(app)
                .get(`/users/${new ObjectID().toHexString()}`)
                .expect(404)
                .end((err, res) => {
                    if (err) throw err
                    done()
                })
        })
    })
})