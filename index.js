// Main exports from module

const { readJellyYaml } = require('./src/jellyYaml')

const jelly = readJellyYaml()


const expObj = {
    // Basic set up
    app:                require('./src/app'),

    cors:               require('./src/cors'),
    inputParser:        require('./src/inputParser'),
    originChecker:      require('./src/originChecker'),

    readConfig:         readJellyYaml,
}


if (jelly.useFrontend === true) {
    Object.assign(expObj, {
        // Frontend
        pugFns:             require('./src/pug-fns'),
        useAsset:           require('./src/useAsset'),
    })

    if (jelly.frontend.useStatic === true) {
        Object.assign(expObj, {
            serveStatic:        require('./src/serveStatic'),
        })
    }
}


if (jelly.useBackend === true) {
    Object.assign(expObj, {
        APIError:           require('./src/apiError'),

        checkFieldsExist:   require('./src/checkFieldsExist'),
        routing:            require('./src/routing'),
        swaggerServer:      require('./src/swaggerServer'),

        // Bookshelf stuff + models/collections (to be extended)
        jellyKnex:          require('./src/knex'),
        bookshelf:          require('./src/bookshelf'),

        baseModel:          require('./src/baseModel'),
        baseCollection:     require('./src/baseCollection'),

        // Nice functions
        slack:              require('./src/slack'),
    })

    if (jelly.backend.useAuth === true) {
        Object.assign(expObj, {
            // Sessions + users
            sessionMiddleware:  require('./src/sessionMiddleware'),
            auth:               require('./src/auth'),

            baseUserModel:      require('./src/baseUserModel'),
            baseSessionModel:   require('./src/baseSessionModel'),

            sessionController:  require('./src/sessionController'),
            userController:     require('./src/userController'),
        })
    }
}


module.exports = expObj
