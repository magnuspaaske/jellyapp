// Setting up the basic app

const express       = require('express')
const compression   = require('compression')

const inputParser   = require('./inputParser')
const cors          = require('./cors')
const originChecker = require('./originChecker')

const makeApp = () => {
    const app = express()

    app.use(compression())

    app.set('port', process.env.PORT || 5000)

    // Middleware
    inputParser(app)
    cors(app)
    originChecker(app)

    return app
}

module.exports = makeApp
