// Add user/session tables to a project

const { copyFiles, addMigration } = require('./copyFileToProject')

const {
    readJellyYaml,
    writeJellyYaml,
} = require('../src/jellyYaml')

const addMigrationFile = () => {
}

const addFiles = () => {
    copyFiles({
        files: {
            'app/models/userModel.js':       'templates/userBase.js',
            'app/models/sessionModel.js':    'templates/sessionBase.js',
        }
    })
}


const setupUserSessions = () => {
    // Add migrations
    addMigration({
        migrationName: 'addUserSessionTables'
    })

    // Add boilerplate
    copyFiles({
        files: {
            'app/models/userModel.js':       'templates/userBase.js',
            'app/models/sessionModel.js':    'templates/sessionBase.js',
        }
    })

    // Update jelly.yaml
    const jellyYaml = readJellyYaml()
    if (!(typeof jellyYaml.backend === 'object')) jellyYaml.backend = {}
    jellyYaml.backend.useAuth = true
    writeJellyYaml(jellyYaml)
}

module.exports = setupUserSessions
