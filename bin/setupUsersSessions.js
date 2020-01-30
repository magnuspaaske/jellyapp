// Add user/session tables to a project

const moment = require('moment')

const copyFileToProject = require('./copyFileToProject')

const addMigrationFile = () => {
    const now = moment().format('YYYYMMDDhhmmss')

    copyFileToProject({
        originLocation: 'migrations/addUserSessionTables.js',
        destinationLocation: `migrations/${now}_addUserSessionTables.js`,
    })
}

module.exports = () => {
    addMigrationFile()
}
