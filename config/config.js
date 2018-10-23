const env = process.env.NODE_ENV || 'development'

if (env === 'development' || env === 'test') {
    const config = require('./config.json')
    Object.keys(config[env]).forEach((key) => {
        process.env[key] = config[env][key]
    })
}