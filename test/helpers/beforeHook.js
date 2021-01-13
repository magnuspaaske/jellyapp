// test/helpers/beforeHook
// Resetting database and getting user tokens

const _         = require('lodash')

const knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
})

const Session   = require('./testSessionModel')
const User      = require('./testUserModel')

const MigrationSource   = require('./migrationSource')

const beforeHook = (tokenObj) => {
    return () => knex.migrate.latest({
        migrationSource: new MigrationSource()
    })
    // Clear database
    .then(() => knex('sessions').del())
    .then(() => knex('users').del())
    // Add users
    .then(() => Promise.all([
        Promise.resolve(new User({email: 'admin@example.com', is_admin: true}).setPassword('password')).then(user => user.save()),
        Promise.resolve(new User({email: 'user@example.com'}).setPassword('password')).then(user => user.save()),
    ]))
    // Make sessions
    .then(() => Promise.all(['user', 'admin'].map(handle => {
        return new User({ email: `${handle}@example.com` })
            .fetch()
            .then(user => {
                return new Session({
                    user_id: user.id
                }).save()
            })
            .then(session => tokenObj[handle] = `Bearer ${session.generateToken()}`)
    })))
    .then(() => knex.destroy())
}

module.exports = beforeHook
