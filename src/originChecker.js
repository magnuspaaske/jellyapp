// Middleware to redirect to page origin domain

const _ = require('lodash')

// TODO: add settings for redirect etc
module.exports = (app) => {
    app.use((req, res, next) => {
        // Only do something if origins is set
        if (!process.env.PAGE_ORIGIN) return next()

        // Split page origin in case there's multiple
        const origins = process.env.PAGE_ORIGIN.split(/[,,;]/)

        if (!_(origins).includes(`${req.protocol}://${req.get('host')}`)) {
            return res.redirect(origins[0])
        }

        next()
    })
}
