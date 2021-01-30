// Middleware to redirect to page origin domain

const _ = require('lodash')

// TODO: add settings for redirect etc
module.exports = (app) => {
    app.use((req, res, next) => {
        // Only do something if origins is set
        if (!process.env.PAGE_ORIGIN) return next()

        let originSplit = process.env.PAGE_ORIGIN.split('://')

        if (originSplit.length === 1) return next()

        const hostMatch = originSplit[1] === req.get('host')
        const protoMatch = req.headers['x-forwarded-proto'] ?
            req.headers['x-forwarded-proto'] === originSplit[0] :
            req.protocol === originSplit[0]

        if (
            process.env.NODE_ENV === 'production' &&
            (!hostMatch || !protoMatch)
        ) {
            return res.redirect(`${process.env.PAGE_ORIGIN}${req.url}`)
        }

        next()
    })
}
