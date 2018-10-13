const express = require('express')
const app = express()

const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('expREST !')
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.send('ok')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})