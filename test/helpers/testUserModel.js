const APIError      = require('../../src/apiError')
const baseUserModel = require('../../src/baseUserModel')


const User = baseUserModel({
    uuid: true
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
