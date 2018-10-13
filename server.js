const express = require('express')

const postRouter = require('./routes/post')

const app = express()
const port = 3000

app.use(express.json())

app.use('/posts', postRouter)

app.get('/', (req, res) => {
    res.send('expREST !<br> Make request to /posts')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})