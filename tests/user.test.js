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
    User.remove({}, function (err) {
        if (err) throw err
    })
    users.forEach(user => {
        var userDoc = new User(user)
        userDoc.save().then().catch()
    })
})

afterEach(function () {
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

    describe('POST /users', () => {
        var user = {
            email: 'test@gmail.com',
            password: 'testpassword'
        }
        it('should save new user and return it', (done) => {
            request(app)
                .post('/users')
                .send(user)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).to.not.be.empty()
                    expect(res.body.email).to.equal(user.email)
                })
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }
                    User.findOne({ email: user.email })
                        .then((result) => {
                            expect(result).to.not.be.empty()
                            done()
                        })
                        .catch(err => done(err))
                })
        })

        it('should return error with invalid data', (done) => {
            request(app)
                .post('/users')
                .send({ email: 'b' })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    User.findOne({ emai: 'b' })
                        .then((result) => {
                            expect(result).to.be.eql(null)
                            done()
                        })
                        .catch(err => done(err))
                })
        })

        it('shouldn\'t save user if email exist', (done) => {
            request(app)
                .post('/users')
                .send({ email: users[0].email, password: users[0].password })
                .expect(400)
                .expect((res) => {
                    expect(res.body.errmsg).to.not.be.empty()
                })
                .end((err, res) => {
                    if (err) {
                        done(err)
                    }
                    done()
                })
        })
    })

    describe('PATCH /users', () => {

        it('should update the user', (done) => {
            var id = users[0]._id
            request(app)
                .patch(`/users/${id}`)
                .send({ email: 'updated@gmail.com', password: 'updatedpass' })
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).to.be.equal(id)
                    expect(res.body.email).to.be.equal('updated@gmail.com')
                    expect(res.body.updatedAt).to.not.be.empty()
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    User.findOne({ _id: id })
                        .then((result) => {
                            expect(result.email).to.be.equal('updated@gmail.com')
                            done()
                        })
                        .catch(err => done(err))
                })
        })

        it('should return error if update info is not valid', (done) => {
            request(app)
                .patch(`/users/${users[0]._id}`)
                .send({ email: 'invalidmail' })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })

        it('should return error if id is invalid', (done) => {
            request(app)
                .patch('/users/invalid')
                .send({ email: 'updated@gmail.com' })
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('DELETE /users', () => {
        it('should remove the user with given id', (done) => {
            var id = users[0]._id

            request(app)
                .delete(`/users/${id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).to.be.equal(id)
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }

                    User.findOne({ _id: id })
                        .then((user) => {
                            expect(user).to.be.eql(null)
                            done()
                        })
                        .catch(err => done(err))
                })
        })

        it('should return error if id is invalid or not found', (done) => {
            request(app)
                .delete('/users/invalidid')
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })
    })

})