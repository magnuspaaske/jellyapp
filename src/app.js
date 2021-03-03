// Setting up the basic app

const express       = require('express')
const compression   = require('compression')

const makeApp = ({
    useBackend = require('./jellyYaml').readJellyYaml().useBackend,
    inputLimit = 1,
} = {}) => {
    // Make express to extend
    const app = express()

    // Compression, obviously
    app.use(compression())

    // Standard port 5000, can be changed in .env
    app.set('port', process.env.PORT || 5000)

    if (useBackend) {
        // Middleware
        require('./inputParser')(app, inputLimit)
        require('./cors')(app)
        require('./originChecker')(app)
    }

    // Locals


    return app
}

module.exports = makeApp
