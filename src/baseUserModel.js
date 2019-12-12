// A user model to be extended

const _         = require('lodash')
const Promise   = require('bluebird')
const bcrypt    = require('bcrypt')
const baseModel = require('./baseModel')


const baseUserModel = (props, staticProps) => {
    const UserModel = baseModel('User', 'users', Object.assign({
        sessions () {
            return this.hasMany('Session')
        },

        // Fields that shouldn't be send to the user
        sensitiveFields () {
            const arr = [
                'password',
                'has_login',
                'password_request_time',
                'password_reset_token'
            ]

            if (!this.get('is_admin')) arr.push('is_admin')

            return arr
        },

        // Set password
        setPassword (new_password) {
            return new Promise((resolve, reject) => {
                bcrypt.hash(new_password, 10, (err, hash) => {
                    if (err) return reject(err)

                    this.set({
                        password: hash
                    })
                    resolve(this)
                })
            })
        },

        // Check password
        checkPassword (password) {
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, this.get('password'), (err, res) => {
                    if (err) return reject(err)

                    resolve(res)
                })
            })
        },


        // Log all sessions out excepted allowed list (okSessions)
        logout (okSessions = []) {
            if (!Array.isArray(okSessions)) {
                okSessions = [okSessions]
            }

            const returnPromise = (user) => {
                return Promise.all(_.times(user.related('sessions').length, (i) => {
                    let session = user.related('sessions').at(i)
                    if (session.get('active') && !_(okSessions).includes(session.id)) {
                        return session.save({
                            active: false
                        })
                    } else {
                        return Promise.resolve()
                    }
                })).then(() => user)
            }

            if (this.related('sessions').length === 0) {
                return this.related('sessions').fetch()
                    .then(() => returnPromise(this).then((user) => user))
            } else {
                return returnPromise(this).then((user) => user)
            }
        },
    }, props))

    if ((typeof staticProps) === 'object') {
        _(staticProps).each((fun, key) => {
            userModel[key] = fun
        })
    }

    return UserModel
}

module.exports = baseUserModel
