// Middleware to redirect to page origin domain

const _ = require('lodash')

// TODO: add settings for redirect etc
module.exports = (app) => {
    app.use((req, res, next) => {
        // Only do something if origins is set
        if (!process.env.PAGE_ORIGIN) return next()


        if (
            process.env.NODE_ENV === 'production' &&
            process.env.PAGE_ORIGIN !== `${req.protocol}://${req.get('host')}`
        ) {
            return res.redirect(`${process.env.PAGE_ORIGIN}${req.url}`)
        }

        next()
    })
}
