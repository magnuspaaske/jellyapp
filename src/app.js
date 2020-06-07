// Setting up the basic app

const express       = require('express')
const compression   = require('compression')

const inputParser   = require('./inputParser')
const cors          = require('./cors')
const originChecker = require('./originChecker')

const makeApp = () => {
    // Make express to extend
    const app = express()

    // Compression, obviously
    app.use(compression())

    // Standard port 5000, can be changed in .env
    app.set('port', process.env.PORT || 5000)

    // Middleware
    inputParser(app)
    cors(app)
    originChecker(app)

    // Locals


    return app
}

module.exports = makeApp
