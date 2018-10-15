const express = require('express')

const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

const app = express()
const port = 3000

app.use(express.json())

app.use('/posts', postRouter)
app.use('/users', userRouter)

app.get('/', (req, res) => {
    res.send('expREST !<br> Make request to /posts')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})