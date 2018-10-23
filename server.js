require('./config/config')
const express = require('express')

const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/posts', postRouter)
app.use('/users', userRouter)

app.get('/', (req, res) => {
    res.send('Exprest !<br> DOC: <a href="https://github.com/fatihint/exprest">https://github.com/fatihint/exprest</a>')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

module.exports = { app }