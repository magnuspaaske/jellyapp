// Options for dealing with Knex

let dbConfig = {
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
    },
    pool: {
        min: 2,
        max: 10
    }
}

if (process.env.NODE_ENV === 'production') {
    dbConfig.connection.ssl = {
        rejectUnauthorized: false
    }
}


module.exports = {
    knex:       () => (dbConfig),
    setKnex:    (newKnex) => {
        dbConfig = Object.assign({}, dbConfig, newKnex)
        return dbConfig
    },
}
