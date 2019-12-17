// A basic, extendable router for sessions

const Router = require('express').Router

const makeSessionRouter = (auth, sessionController) => {
    if (
        // typeof router === 'undefined' ||
        typeof auth === 'undefined' ||
        typeof sessionController === 'undefined'
    ) {
        throw new Error('makeSessionRouter must be called with the auth and session controller specified')
    }

    const router = Router()

    // Log in/create new session
    router.post('/sessions',
        // No auth necessary
        sessionController.createSession
    )

    // Update a session
    router.put('/sessions/:session_id',
        auth(),
        sessionController.updateSession
    )

    return router
}

module.exports = makeSessionRouter
