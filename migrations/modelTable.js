/**
 * Jellyapp
 * This is the boilerplate for a Jelly migration. The code is created with the
 *  Jelly CLI and can safely be edited
 */

// A migration to add tables for {MODELNAME_PLURAL}

exports.up = (knex, Promise) => {

    // Create table
    return knex.schema.createTable('{MODELNAME_PLURAL}', table => {
        table.increments('id').primary()

        table.timestamps()
    })
}

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('{MODELNAME_PLURAL}')
}
