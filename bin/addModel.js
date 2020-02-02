// Add a model and migration

const pluralize = require('pluralize')
const { copyFile, copyFiles, addMigration } = require('./copyFileToProject')
const insertLinesInFile = require('./insertLinesInFile')


const addModel = ({
    modelName = null,
    pluralName = null,
    tablename = null,
    router = true,
} = {}) => {
    if (!modelName) {
        const txt = 'modelName must be set for addModel to work'
        throw new Error(txt)
    }

    const modelnameCap = modelName.replace(/^\w/, modelName => modelName.toUpperCase())
    const modelnameUncap = modelName
    const modelnamePlural = pluralName ? pluralName : pluralize(modelName)
    tablename = tablename ? tablename : modelnamePlural

    const settings = {
        modelnameCap,
        modelnameUncap,
        modelnamePlural,
        tablename,
    }

    // Insert collection and model
    console.log('Making model and collection files ...')
    copyFiles({
        files: {
            [`app/collections/${modelName}Collection.js`]:  'templates/collectionBase.js',
            [`app/models/${modelName}Model.js`]:            'templates/modelBase.js',
        },
        settings
    })

    // Insert migration
    console.log('Making migration file ...')
    addMigration({
        migrationName: `add${modelnameCap}`,
        migrationTmpName: 'modelTable',
        settings
    })

    // Insert router if needed
    if (router) {
        console.log('Adding router ...')
        copyFile({
            originLocation:         'boilerplate/templates/modelRouter.js',
            destinationLocation:    `app/routers/${modelName}Router.js`,
            settings,
        })
        insertLinesInFile({
            fileLocation: 'index.js',
            lines: `app.use('/api/v0', require('./app/routers/${modelName}Router'))`,
            symbol: 'routes',
        })
    } else {
        console.log('Continuing without adding router ...')
    }

    console.log(`Created ${modelName} model`)
}

module.exports = addModel
