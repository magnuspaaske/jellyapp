console.log('Jelly index hello world')

module.exports = {
    // Basic set up
    cors:           require('./src/cors'),
    inputParser:    require('./src/inputParser'),
    originChecker:  require('./src/originChecker'),

    // Nice functions
    slack:          require('./src/slack'),

    // Frontend
    pugFns:         require('./src/pug-fns')
}
