// Setting up the basic app

const jelly = require('jellyapp')

const express       = require('express')
const compression   = require('compression')

const makeApp = () => {
    // Make express to extend
    const app = express()

    // Compression, obviously
    app.use(compression())

    // Standard port 5000, can be changed in .env
    app.set('port', process.env.PORT || 5000)

    if (require('./jellyYaml').readJellyYaml().useBackend) {
        // Middleware
        require('./inputParser')(app)
        require('./cors')(app)
        require('./originChecker')(app)
    }

    // Locals


    return app
}

module.exports = makeApp
