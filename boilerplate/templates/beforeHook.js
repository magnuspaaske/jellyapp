// test/helpers/beforeHook
// Resetting database and getting user access tokens

const knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
})


const beforeHook = () => {
    return () => knex.migrate.latest()
        .then(() => knex.seed.run())
}

module.exports = beforeHook
