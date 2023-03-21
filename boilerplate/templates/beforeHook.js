// test/helpers/beforeHook
// Migrating to latest database and seeding database

const knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
});

const beforeHook = () => {
    return () =>
        knex.migrate
            .rollback()
            .then(() => knex.migrate.latest())
            .then(() => knex.seed.run())
            .then(() => knex.destroy());
};

module.exports = beforeHook;
