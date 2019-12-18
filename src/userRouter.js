// A basic, extendable router for to deal with users

const Router = require('express').Router

const makeUserRouter = (auth, userController) => {
    if (
        typeof auth === 'undefined' ||
        typeof userController === 'undefined'
    ) {
        throw new Error('makeUserRouter must be called with the auth and user controller specified')
    }

    const router = Router()

    // Get current user
    router.get('/users/me',
        auth(),
        userController.getCurrentUser
    )

    // Make new user
    router.post('/users',
        userController.createUser
    )

    // Update user
    router.put('/users/me',
        auth(),
        userController.updateCurrentUser
    )

    // Update user password
    router.put('/users/me/password',
        auth(),
        userController.changePassword
    )


    // Make new user
    router.post('/users/make-admin',
        auth(),
        userController.createNewAdmin,
    )

    // // Reset password, forgot password
    // router.post('/users/forgot-password',
    //     userController.requestPassword
    // )
    // router.post('/users/reset-password',
    //     userController.resetPassword
    // )

    router.post('/users/create-first-user',
        userController.makeFirstUser
    )

    return router
}


module.exports = makeUserRouter
