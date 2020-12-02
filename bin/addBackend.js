// Set up backend for a project

const setupUsersSessions = require('./setupUsersSessions')

const {
    installYarnDeps,
    updatePkgScripts,
} = require('./util')
const {
    readJellyYaml,
    writeJellyYaml,
} = require('../src/jellyYaml')


const addBackend = (withAuth = false) => {
    if (withAuth) {
        setupUsersSessions()
    }

    // Install
    console.log('Installing yarn dependencies for backend ...')
    installYarnDeps([
        'bcrypt',
        'bookshelf',
        'bookshelf-uuid',
        'cookie-parser',
        'cors',
        'express-fileupload',
        'jsonwebtoken',
        'knex',
        'pg',
        'request',
        'showdown',
        'swagger-parser',
        'swagger-routes-express',
        'swagger-ui-express',
    ])

    updatePkgScripts({
        migrate:    'knex migrate:latest',
    })

    const jellyYaml = readJellyYaml()
    jellyYaml.useBackend = true
    jellyYaml.backend = {
        useAuth:    withAuth
    }
    writeJellyYaml(jellyYaml)
}

module.exports = addBackend
