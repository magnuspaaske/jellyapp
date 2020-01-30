/**
 * Jellyapp
 * This is the boilerplate for a Jelly user model. The code is created with the
 *  Jelly CLI and can safely be edited
 */


const {
    APIError,
    baseUserModel,
} = require('jellyapp')


const User = baseUserModel({

})

User.fetchById = (id) => {
    return new User({
        id
    })
        .fetch()
        .catch(() => {
            throw new APIError(404, 'User not found')
        })
}

module.exports = User
