const expect = require('expect.js')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../server.js')
const Post = require('../models/post')

const { users, posts, populatePosts, populateUsers } = require('../tests/seed/seed')

beforeEach(populateUsers)
beforeEach(populatePosts)

describe('POST', () => {

    describe('GET /posts', () => {
        it('should get all posts', (done) => {
            request(app)
                .get('/posts')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.posts.length).to.be(1)
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('GET /posts/:id', () => {
        it('should get the post with given id', (done) => {
            request(app)
                .get(`/posts/${posts[0]._id}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.title).to.equal(posts[0].title)
                    expect(res.body.body).to.equal(posts[0].body)
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })

        it('should return 404 when id is invalid', (done) => {
            request(app)
                .get('/posts/invalidid')
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })

        it('should return 404 when post with :id doesn\'t exists', (done) => {
            request(app)
                .get(`/posts/${new ObjectID().toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('POST /posts', () => {
        it('should save a new post and return it', (done) => {
            var post = {
                title: 'titltltltl',
                body: 'bobobybyb'
            }

            request(app)
                .post('/posts')
                .set('x-auth', users[0].tokens[0].token)
                .send(post)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).to.not.be.empty()
                    expect(res.body.title).to.equal(post.title)
                    expect(res.body.body).to.equal(post.body)
                })
                .end((err, result) => {
                    if (err) {
                        return done(err)
                    }
                    Post.findOne({ title: post.title })
                        .then((result) => {
                            expect(result).to.not.be.empty()
                            done()
                        })
                        .catch(err => done(err))
                })
        })

        it('should return error with invalid data', (done) => {
            request(app)
                .post('/posts')
                .set('x-auth', users[0].tokens[0].token)
                .send({ title: 'b' })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    Post.findOne({ title: 'b' })
                        .then((result) => {
                            expect(result).to.be.eql(null)
                            done()
                        })
                        .catch(err => done(err))
                })
        })

        it('shouldn\'t save post if title exist', (done) => {
            request(app)
                .post('/posts')
                .set('x-auth', users[0].tokens[0].token)
                .send({ title: posts[0].title, body: posts[0].body })
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

    describe('PATCH /posts', () => {

        it('should update the post', (done) => {
            var id = posts[0]._id.toHexString()
            request(app)
                .patch(`/posts/${id}`)
                .set('x-auth', users[0].tokens[0].token)
                .send({ title: 'updated', body: 'updatedbody' })
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).to.be.equal(id)
                    expect(res.body.title).to.be.equal('updated')
                    expect(res.body.updatedAt).to.not.be.empty()
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    Post.findOne({ _id: id })
                        .then((result) => {
                            expect(result.title).to.be.equal('updated')
                            done()
                        })
                        .catch(err => done(err))
                })
        })


        it('should return error if update info is not valid', (done) => {
            var id = posts[0]._id.toHexString()
            request(app)
                .patch(`/posts/${id}`)
                .set('x-auth', users[0].tokens[0].token)
                .send({ title: '' })
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
                .patch('/posts/invalid')
                .set('x-auth', users[0].tokens[0].token)
                .send({ title: "newtitle" })
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })

    })

    describe('DELETE /posts', () => {
        it('should remove the post with given id', (done) => {
            var id = posts[0]._id.toHexString()

            request(app)
                .delete(`/posts/${id}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).to.be.equal(id)
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }

                    Post.findOne({ _id: id })
                        .then((post) => {
                            expect(post).to.be.eql(null)
                            done()
                        })
                        .catch(err => done(err))
                })
        })

        it('should return error if id is invalid or not found', (done) => {
            request(app)
                .delete('/posts/invalidid')
                .set('x-auth', users[0].tokens[0].token)
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