// A way to get a basic, extendable session controller
const { apiHandler }    = require('./handlers')
const APIError          = require('./apiError')


const makeSessionController = ((User, Session) => {
    if (typeof User === 'undefined' || typeof Session === 'undefined') {
        throw new Error('makeSessionController must be called with the user and session model specified')
    }

    const controller = {}

    // Update a session (to cancel it)
    controller.updateSession = apiHandler((req, res) => {
        return new Session({
            id:         req.params.session_id,
            user_id:    req.user.id,
        })
            .fetch()
            .then(session => {
                if (
                    session.get('user_id') !== req.user.id ||
                    !session.get('active')
                ) {
                    throw new APIError(404, 'The session was not found')
                }
                return session.save(req.body)
            })
            .then((session) => {
                res.send(session)
            })
            .catch(Session.NotFoundError, (err) => {
                throw new APIError(404, 'The session was not found')
            })
    })


    // Make session
    controller.createSession = apiHandler((req, res) => {
        // Sanity checks
        if (!req.body.email) return APIError.promise(401, 'Email must be set to log in')
        if (!req.body.password) return APIError.promise(401, 'Password must be set to log in')

        // The error the log in is rejected
        const err403 = new APIError(403, 'User not found or password incorrect')

        return new User({
            email: req.body.email.toLowerCase()
        })
            .fetch()
            .then(user => {
                return user.checkPassword(req.body.password).then(result => {
                    if (result) return user
                    throw err403
                })
            })
            .then(user => {
                return new Session({
                    user_id: user.id
                })
                    .save()
                    .then(session => {
                        user.set({
                            token: session.generateToken()
                        })

                        res.status(202)
                        res.send(user)
                    })
            })
            .catch(User.NotFoundError, (err) => {
                throw err403
            })
    })

    return controller
})


module.exports = makeSessionController
