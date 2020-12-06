// A migration to add tables for users and sessions

exports.up = (knex) => {

    return knex.schema.createTable('users', table => {
        // Users
        table.increments('id').primary()
        // table.uuid('id').primary()
        table.string('email').unique()
        table.string('password', 1023)
        table.boolean('is_admin').defaultTo(false)

        table.timestamps()
    }).then(() => {
        // Sessions
        return knex.schema.createTable('sessions', table => {
            table.increments('id').primary()
            // table.uuid('id').primary()
            table.boolean('active').defaultTo(true)
            table.integer('user_id').references('users.id').index()
            // table.uuid('user_id').references('users.id').index()
            table.timestamps()
        })
    })
}

exports.down = (knex) => {
    return knex.schema.dropTable('sessions')
        .then(() => knex.schema.dropTable('users'))
}
