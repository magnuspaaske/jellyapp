// test/helpers/afterHook
// Destroying knex object

module.exports = () => {
    const { bookshelf } = require('jellyapp');
    const knex = bookshelf.knex;

    knex.destroy();
    process.exit(0);
};
