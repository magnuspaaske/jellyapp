// Middleware to redirect to page origin domain

module.exports = (app) => {
    app.use((req, res, next) => {
        if (`${req.protocol}://${req.get('host')}` !== process.env.PAGE_ORIGIN) {
            return res.redirect(`${process.env.PAGE_ORIGIN}${req.url}`)
        }

        next()
    })
}
