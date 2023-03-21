// test/helpers/afterHook
// Destroying knex object

const { bookshelf } = require('jellyapp');
const knex = bookshelf.knex;

module.exports = () => {
    knex.destroy();
};
