// Main exports from module

module.exports = {
    // Basic set up
    app:                require('./src/app'),

    cors:               require('./src/cors'),
    inputParser:        require('./src/inputParser'),
    originChecker:      require('./src/originChecker'),

    APIError:           require('./src/apiError'),

    // Bookshelf stuff + models/collections (to be extended)
    jellyKnex:          require('./src/knex'),
    bookshelf:          require('./src/bookshelf'),

    baseModel:          require('./src/baseModel'),
    baseCollection:     require('./src/baseCollection'),

    sessionMiddleware:  require('./src/sessionMiddleware'),
    baseUserModel:      require('./src/baseUserModel'),
    baseSessionModel:   require('./src/baseSessionModel'),

    // Nice functions
    slack:              require('./src/slack'),

    // Frontend
    pugFns:             require('./src/pug-fns')
}
