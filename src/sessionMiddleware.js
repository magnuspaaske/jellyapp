/**
 *
 * A middleware for storing session data in JWT tokens
 *
 * The middleware provides a session object in req, that can
 *  store various datas user might want. If it stores a Session ID
 *  and a User Id, a user object will be appended to the req object
 *
 */


const _         = require('lodash')
const Promise   = require('bluebird')
const moment    = require('moment')

const jwt       = require('jsonwebtoken')

const Session   = require('./baseSessionModel')


// Make tokens
const jwt_secret = process.env.SESSION_SECRET || 'super-secret'
const jwt_algorithm = 'HS256'


// Object that can be added on req
function sessionObj (attr, req, res) {
    const useHeader = req.headers.authorization

    this.attributes = attr

    // Make function to get signed cookie
    const setSessionCookie = () => {
        if (useHeader) return
        res.cookie('session', jwt.sign(this.attributes, jwt_secret, {
            algorithm: jwt_algorithm
        }), {
            expires: moment().add(1, 'year').toDate()
        })
    }

    const resetSessionCookie = () => {
        delete this.attributes['session_id']
        delete this.attributes['user_id']
        setSessionCookie()
    }

    // Make setter
    this.set = (key, val) => {
        this.attributes[key] = val
        // Save session
        setSessionCookie()
        return val
    }

    // Make getter
    this.get = (key) => {
        return this.attributes[key]
    }

    // Delete on key
    this.delete = (key) => {
        delete this.attributes[key]
        // Save session
        setSessionCookie()
    }

    // Setting session on req
    req.session = this
    res.locals.session = this

    if (this.get('session_id') && this.get('user_id')) {
        // Finding session and user id
        return new Session({
            id:         this.get('session_id'),
            user_id:    this.get('user_id'),
        })
            .fetch({
                withRelated: ['user']
            })
            .then((session) => {
                if (!session.get('active')) {
                    resetSessionCookie()
                    return
                }

                const user = session.related('user')

                // We have the user, append to req/this
                this.session = session
                this.user = user
                req.user = user

                setSessionCookie()
                return
            })
            .catch(Session.NotFoundError, (err) => {
                resetSessionCookie()
                return
            })
    } else {
        // No user
        resetSessionCookie()
        return Promise.resolve()
    }
}


module.exports = (req, res, next) => {
    const emptySession = () => new sessionObj({}, req, res).then(next)

    if (req.headers.authorization) {
        const [scheme, token] = req.headers.authorization.split(' ')

        if (!(scheme === 'Bearer' && token)) {
            // Scheme is not right
            return emptySession()
        }
        // Setting session
        jwt.verify(token, jwt_secret, {
            algorithm: [jwt_algorithm],
            ignoreExpiration: true,
        }, (err, payload) => {
            if (err) {
                delete req.headers.authorization
                return emptySession()
            }
            return new sessionObj(_.pick(payload, ['user_id', 'session_id']), req, res).then(next)
        })

    } else if (req.cookies.session) {

        jwt.verify(req.cookies.session, jwt_secret, {
            algorithm: [jwt_algorithm],
            ignoreExpiration: true,
        }, (err, payload) => {
            // On error, simply make a new session object
            if (err) return emptySession()
            return new sessionObj(payload, req, res).then(next)
        })

    } else {
        // Has to create session
        return emptySession()
    }
}
