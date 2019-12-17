// Main exports from module

const handlers = require('./src/handlers')

module.exports = {
    // Basic set up
    app:                require('./src/app'),

    cors:               require('./src/cors'),
    inputParser:        require('./src/inputParser'),
    originChecker:      require('./src/originChecker'),

    APIError:           require('./src/apiError'),

    handler:            handlers.handler,
    apiHandler:         handlers.apiHandler,
    pageHandler:        handlers.pageHandler,

    checkFieldsExist:   require('./src/checkFieldsExist'),

    // Bookshelf stuff + models/collections (to be extended)
    jellyKnex:          require('./src/knex'),
    bookshelf:          require('./src/bookshelf'),

    baseModel:          require('./src/baseModel'),
    baseCollection:     require('./src/baseCollection'),

    // Sessions + users
    sessionMiddleware:  require('./src/sessionMiddleware'),
    auth:               require('./src/auth'),

    baseUserModel:      require('./src/baseUserModel'),
    baseSessionModel:   require('./src/baseSessionModel'),

    sessionController:  require('./src/sessionController'),
    userController:     require('./src/userController'),

    sessionRouter:      require('./src/sessionRouter'),
    userRouter:         require('./src/userRouter'),

    // Nice functions
    slack:              require('./src/slack'),

    // Frontend
    pugFns:             require('./src/pug-fns')
}
