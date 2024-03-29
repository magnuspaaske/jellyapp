/**
 * Jellyapp
 * This is the boilerplate for a Jelly migration. The code is created with the
 *  Jelly CLI and can safely be edited
 */

// A migration to add tables for {MODELNAME_PLURAL}

exports.up = (knex) => {
    // Create table
    return knex.schema.createTable('{MODELNAME_PLURAL}', (table) => {
        table.increments('id').primary();
        // table.uuid('id').primary()

        table.timestamps();
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('{MODELNAME_PLURAL}');
};
