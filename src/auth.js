// auth middleware to authenticate requests

const Promise           = require('bluebird')
const { apiHandler }    = require('./handlers')
const APIError          = require('./apiError')


module.exports = (resources = {}) => {
    return apiHandler((req, res, next) => {
        const session = req.session

        // Check that there is a user
        if (!session.user) {
            return APIError.promise(403, 'You must be logged in to view this page')
        }

        // Check that there's an admin
        if (resources.admin) {
            if (session.user.get('is_admin') !== true) {
                return APIError.promise(403, 'You must have admin privileges to view this page')
            }
        }

        return Promise.resolve(next())
    })
}
