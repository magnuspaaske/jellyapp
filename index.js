console.log('Jelly index hello world')

module.exports = {
    // Basic set up
    cors:           require('./src/cors'),
    inputParser:    require('./src/inputParser'),
    originChecker:  require('./src/originChecker'),

    APIError:       require('./src/apiError'),

    // Bookshelf stuff + models/collections (to be extended)
    jellyKnex:      require('./src/knex'),
    bookshelf:      require('./src/bookshelf'),

    baseModel:      require('./src/baseModel'),
    baseCollection: require('./src/baseCollection'),

    // Nice functions
    slack:          require('./src/slack'),

    // Frontend
    pugFns:         require('./src/pug-fns')
}
