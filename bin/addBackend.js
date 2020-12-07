// Set up backend for a project

const setupUsersSessions = require('./setupUsersSessions')

const {
    copyFile,
    copyFiles,
} = require('./copyFileToProject')
const {
    installYarnDeps,
    updatePkgScripts,
} = require('./util')
const {
    readJellyYaml,
    writeJellyYaml,
} = require('../src/jellyYaml')


const addBackend = (withAuth = false) => {

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
    writeJellyYaml(jellyYaml)

    // Set up tests
    copyFile({
        originLocation: 'boilerplate/templates/beforeHook.js',
        destinationLocation: 'test/helpers/beforeHook.js',
    })
    copyFile({
        originLocation: 'boilerplate/api-template.yaml',
        destinationLocation: 'api.yaml',
    })

    if (withAuth) setupUsersSessions()
}

module.exports = addBackend
