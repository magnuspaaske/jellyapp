// A way to get a basic, extendable user controller

const _         = require('lodash')
const Promise   = require('bluebird')


const checkFieldsExist  = require('./checkFieldsExist')
const APIError          = require('./apiError')


const makeUserController = ((User) => {

    if (typeof User === 'undefined') {
        throw new Error('makeUserController must be called with the user model specified')
    }

    const controller = {}

    // Get current user
    controller.getCurrentUser = (req, res) => {
        res.send(req.user)
    }


    // Update user
    controller.updateCurrentUser = (req, res, next) => {
        const omits = [
            'email',
            'created_at',
            'updated_at',
            'id',
            ...req.user.hidden
        ]

        return req.user
            .save(_.omit(req.body, omits))
            .then((user) => {
                res.send(user)
            })
            .catch(err => next(err))
    }


    // Change user password
    controller.changePassword = (req, res, next) => {
        const session = req.session

        if (!req.body.password || !req.body.new_password) {
            return next(new APIError(401, 'The old and the new password must be set.'))
        }

        return req.user
            .fetch({
                withRelated: ['sessions']
            })
            .then(user => user.checkPassword(req.body.password).then(result => {
                if (result) return user
                throw new APIError(403, 'The existing password is wrong')
            }))
            // Setting password
            .then(user => user.setPassword(req.body.new_password))
            .then(user => user.logout([session.session.id]))
            .then(user => user.save())
            // Send email that password has been changed
            .then(() => {
                res.sendStatus(204)
            })
            .catch(err => next(err))
    }


    // Make new user
    controller.createUser = (req, res, next) => {
        const fields = ['email', 'password']
        if (!checkFieldsExist(fields, req.body)) {
            throw new APIError(400, 'email or password not set')
        }

        return new User({
            email: req.body.email,
        }).fetch({
            require: false,
        }).then(user => {
            if (user) {
                throw new APIError(409, 'User already exists with provided email')
            }

            return new User({
                email: req.body.email
            }).setPassword(req.body.password)
        }).then(user => user.save())
        .then(user => {
            res.status(201)
            res.send(user)
        })
        .catch(err => next(err))
    }


    // Make admin wether from making first user or as admin
    const makeAdmin = (req, res, next) => {
        const fields = ['email', 'password']
        if (!checkFieldsExist(fields, req.body)) {
            throw new APIError(400, 'email or password not set')
        }

        return new User({
            email: req.body.email
        })
            .fetch({
                require: false,
            })
            .then(user => {
                if (!user) {
                    return new User(req.body).setPassword(req.body.password)
                }
                return user
            })
            .then(user => user.save({
                is_admin: true,
            }))
            .then(user => {
                res.status(201)
                res.send(user)
            })
            .catch(err => next(err))
    }

    // Make new admin
    controller.createNewAdmin = (req, res, next) => {
        // Any admin can make new admins atm
        return makeAdmin(req, res, next)
    }

    // Make first user
    controller.makeFirstUser = (req, res, next) => {
        const firstUserToken = req.headers['first-user-token']

        if (
            !firstUserToken || !process.env.FIRST_USER_TOKEN ||
            firstUserToken !== process.env.FIRST_USER_TOKEN
        ) {
            throw new APIError(403, 'A first user token must be provided or it didn\'t match the server one')
        }

        return makeAdmin(req, res, next)
    }

    return controller
})


module.exports = makeUserController
