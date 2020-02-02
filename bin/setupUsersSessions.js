// Add user/session tables to a project

const fs = require('fs')
const path = require('path')

const { copyFiles, addMigration } = require('./copyFileToProject')
const insertLinesInFile = require('./insertLinesInFile')

const addMigrationFile = () => {
    addMigration({
        migrationName: 'addUserSessionTables'
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
