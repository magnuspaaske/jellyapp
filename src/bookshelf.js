// The main bookshelf object for use throughout project

const jellyKnex = require('./knex')

const dbConfig = jellyKnex.knex()

const knex = require('knex')(dbConfig)
const bookshelf = require('bookshelf')(knex)

// TODO: Add more options for setting up bookshelf

module.exports = bookshelf
