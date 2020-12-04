// A way to get a basic, extendable session controller
const APIError          = require('./apiError')


const makeSessionController = ((User, Session) => {
    if (typeof User === 'undefined' || typeof Session === 'undefined') {
        throw new Error('makeSessionController must be called with the user and session model specified')
    }

    const controller = {}

    // Update a session (to cancel it)
    controller.updateSession = (req, res, next) => {
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
                    next(new APIError(404, 'The session was not found'))
                    return
                }
                return session.save(req.body)
            })
            .then((session) => {
                res.send(session)
            })
            .catch(Session.NotFoundError, (err) => {
                throw new APIError(404, 'The session was not found')
            })
    }


    // Make session
    controller.createSession = (req, res, next) => {
        // Sanity checks
        if (!req.body.email) throw new APIError(401, 'Email must be set to log in')
        if (!req.body.password) throw new APIError(401, 'Password must be set to log in')

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
                        res.status(202)
                        res.send(Object.assign(user.serialize(), {
                            token: session.generateToken(),
                            email: user.get('email')
                        }))
                    })
            })
            .catch(User.NotFoundError, err => {
                next(err403)
            })
            .catch(err => next(err))
    }

    return controller
})


module.exports = makeSessionController
