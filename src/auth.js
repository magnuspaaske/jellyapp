// auth middleware to authenticate requests

const Promise           = require('bluebird')
const APIError          = require('./apiError')


module.exports = (resources = {}) => {
    return (req, res, next) => {
        const session = req.session

        // Check that there is a user
        if (!session.user) {
            throw new APIError(403, 'You must be logged in to view this page')
        }

        // Check that there's an admin
        if (resources.admin) {
            if (session.user.get('is_admin') !== true) {
                throw new APIError(403, 'You must have admin privileges to view this page')
            }
        }

        next()
    }
}
