const knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
});

class MigrationSource {
    getMigrations() {
        return Promise.resolve(['addUserSessionTables']);
    }

    getMigrationName(migration) {
        return migration;
    }

    getMigration(migration) {
        const self = this;
        return self[migration]();
    }

    // Migration 1
    addUserSessionTables() {
        return {
            up(knex) {
                return knex.schema
                    .createTable('users', (table) => {
                        table.uuid('id').primary();
                        table.string('email').unique();
                        table.string('password', 1023);
                        table.boolean('is_admin').defaultTo(false);

                        table.timestamps();
                    })
                    .then(() =>
                        knex.schema.createTable('sessions', (table) => {
                            table.uuid('id').primary();
                            table.boolean('active').defaultTo(true);
                            table
                                .uuid('user_id')
                                .references('users.id')
                                .index();

                            table.timestamps();
                        })
                    );
            },
            down(knex) {
                return knex.schema
                    .dropTable('sessions')
                    .then(() => knex.schema.dropTable('users'));
            },
        };
    }
}

module.exports = MigrationSource;
