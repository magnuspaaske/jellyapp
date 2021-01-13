// test/helpers/afterHook
// Destroying knex object

const knex = require('../../src/bookshelf').knex

module.exports = () => {
    knex.destroy()
}
