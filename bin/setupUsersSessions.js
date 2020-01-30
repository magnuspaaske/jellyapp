// Add user/session tables to a project

const moment = require('moment')

const fs = require('fs')
const path = require('path')

const { copyFile, copyFiles } = require('./copyFileToProject')
const insertLinesInFile = require('./insertLinesInFile')

const addMigrationFile = () => {
    const now = moment().format('YYYYMMDDhhmmss')
    copyFile({
        originLocation: 'migrations/addUserSessionTables.js',
        destinationLocation: `migrations/${now}_addUserSessionTables.js`,
    })
}

const addFiles = () => {
    copyFiles({
        files: {
            'app/models/userModel.js':       'templates/userBase.js',
            'app/models/sessionModel.js':    'templates/sessionBase.js',
        }
    })
}

const readLines = (file) => {
    const fileLoc = path.join(__dirname, `../boilerplate/indexLines/${file}`)
    return fs.readFileSync(fileLoc, 'utf8')
}

const editIndexFile = () => {
    // Insert code to set up session
    insertLinesInFile({
        fileLocation: 'index.js',
        lines: readLines('session.js'),
        symbol: 'session',
    })

    // Insert code to set up routes
    insertLinesInFile({
        fileLocation: 'index.js',
        lines: readLines('sessionRoutes.js'),
        symbol: 'routes',
    })
}



module.exports = () => {
    console.log('Adding migration file')
    addMigrationFile()
    console.log('Added migration file ...')

    console.log('Adding files')
    addFiles()
    console.log('Added files')

    console.log('Editing index file')
    editIndexFile()
    console.log('Edited index file')
}
