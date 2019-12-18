// A way to get a basic, extendable user controller

const _         = require('lodash')
const Promise   = require('bluebird')


const { apiHandler }    = require('./handlers')
const checkFieldsExist  = require('./checkFieldsExist')
const APIError          = require('./apiError')


const makeUserController = ((User) => {

    if (typeof User === 'undefined') {
        throw new Error('makeUserController must be called with the user model specified')
    }

    const controller = {}

    // Get current user
    controller.getCurrentUser = apiHandler((req, res) => {
        return Promise.resolve(res.send(req.user))
    })


    // Update user
    controller.updateCurrentUser = apiHandler((req, res) => {
        const omits = [
            'email',
            'created_at',
            'updated_at',
            'id',
            ...req.user.sensitiveFields()
        ]

        return req.user
            .save(_.omit(req.body, omits))
            .then((user) => {
                res.send(user)
            })
    })


    // Change user password
    controller.changePassword = apiHandler((req, res) => {
        const session = req.session

        if (!req.body.password || !req.body.new_password) {
            return Promise.reject(new APIError(401, 'The old and the new password must be set.'))
        }

        return req.user
            .fetch({
                withRelated: ['sessions']
            })
            .then(user => user.checkPassword(req.body.password).then(result => {
                if (result) return user
                throw new APIError(401, 'The existing password is wrong')
            }))
            // Setting password
            .then(user => user.setPassword(req.body.new_password))
            .then(user => user.logout([session.session.id]))
            .then(user => user.save())
            // Send email that password has been changed
            .then(() => {
                res.sendStatus(204)
            })
    })


    // Make new user
    controller.createUser = apiHandler((req, res) => {
        const fields = ['email', 'password']
        if (!checkFieldsExist(fields, req.body)) {
            return APIError.promise(400, 'email or password not set')
        }

        return new User({
            email: req.body.email,
        }).fetch({
            require: false,
        }).then(user => {
            if (user) {
                throw new APIError(400, 'User already exists with provided email')
            }

            return new User({
                email: req.body.email
            }).setPassword(req.body.password)
        }).then(user => user.save())
        .then(user => {
            res.status(201)
            res.send(user)
        })
    })


    // Make admin wether from making first user or as admin
    const makeAdmin = (req, res) => {
        const fields = ['email', 'password']
        if (!checkFieldsExist(fields, req.body)) {
            return APIError.promise(400, 'email or password not set')
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
    }

    // Make new admin
    controller.createNewAdmin = apiHandler((req, res) => {
        // Any admin can make new admins atm
        return makeAdmin(req, res)
    })

    // Make first user
    controller.makeFirstUser = apiHandler((req, res) => {
        const firstUserToken = req.headers['first-user-token']

        if (
            !firstUserToken || !process.env.FIRST_USER_TOKEN ||
            firstUserToken !== process.env.FIRST_USER_TOKEN
        ) {
            return APIError.promise(403, 'A first user token must be provided or it didn\'t match the server one')
        }

        return makeAdmin(req, res)
    })

    return controller
})


module.exports = makeUserController
