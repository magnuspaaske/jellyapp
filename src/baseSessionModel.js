// An extendible model to work with sessions

const _         = require('lodash')
const jwt       = require('jsonwebtoken')
const baseModel = require('./baseModel')


// Make tokens
const jwt_secret = process.env.SESSION_SECRET || 'super-secret'
const jwt_algorithm = 'HS256'


const baseSessionModel = (props, staticProps) => {
    const sessionModel = baseModel('Session', 'sessions', {
        user () {
            return this.belongsTo('User')
        },

        // Generate token from instance
        generateToken () {
            return jwt.sign({
                session_id: this.id,
                user_id:    this.get('user_id')
            }, jwt_secret, {
                algorithm: jwt_algorithm
            })
        },
    })

    if ((typeof staticProps) === 'object') {
        _(staticProps).each((fun, key) => {
            sessionModel[key] = fun
        })
    }

    return sessionModel
}


module.exports = baseSessionModel
