const expect = require('expect.js')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const Post = require('../models/post')
const { app } = require('../server.js')

const postOneID = new ObjectID().toHexString()
const postTwoID = new ObjectID().toHexString()

const posts = [
    {
        _id: postOneID,
        title: 'Test Title 1',
        body: 'Test body 1'
    },
    {
        _id: postTwoID,
        title: 'Test Title 2',
        body: 'Test body 2'
    }
]

beforeEach(function () {
    Post.remove({}, function(err) {
        if (err) throw err
    })
    posts.forEach(post => {
        var postDoc = new Post(post)
        postDoc.save().then().catch()
    })
})

afterEach(function () {
    posts.forEach(post => {
        Post.findOneAndRemove({
            _id: post._id
        }).then().catch()
    })
})

describe('POST', () => {

    describe('GET /posts', () => {
        it('should get all posts', (done) => {
            request(app)
                .get('/posts')
                .expect(200)
                .expect((res) => {
                    expect(res.status).to.be(200)
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

        var post = {
            title: 'titltltltl',
            body: 'bobobybyb'
        }

        it('should save a new post and return it', (done) => {
            request(app)
                .post('/posts')
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
                    done()
                })
        })

        it('should return error with invalid data', (done) => {
            request(app)
                .post('/posts')
                .send({ title: 'b' })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })

        it('shouldn\'t save post if title exist', (done) => {
            request(app)
                .post('/posts')
                .send({title: posts[0].title, body: posts[0].body})
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
})