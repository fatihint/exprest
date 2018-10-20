const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

mongoose.connection.once('error', console.error.bind(console, 'connection error : '))

mongoose.connection.once('open', () => {
    console.log('DB Connected')
})

module.exports = mongoose