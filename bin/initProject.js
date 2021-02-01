// Set up a project at the beginning

const _  =          require('lodash')
const fs =          require('fs')
const exec =        require('child_process').exec


const figlet =      require('figlet')
const inquirer =    require('inquirer')
const yaml =        require('js-yaml')


const addClient =   require('./addClient')
const addBackend =  require('./addBackend')


const { copyFiles } = require('./copyFileToProject')
const {
    installYarnDeps,
    updatePkgScripts,
} = require('./util')


const initProject = async () => {
    console.log(
        figlet.textSync('Jelly !!', {
            horizontalLayout: 'full'
        }).yellow
    )

    const prompt = inquirer.createPromptModule()
    const answers = await prompt({
        type:       'checkbox',
        message:    'Select components',
        name:       'components',
        choices: [{
            name:   'Frontend in client directory',
            value:  'frontend',
        }, {
            name:   'Static pug in client directory',
            value:  'static_pug',
        // }, {
        //     name:   'Use Jelly Blocks for frontend',
        //     value:  'use_blocks'
        }, {
            name:   'Set up backend app',
            value:  'routes',
        }, {
            name:   'Set up an authentication system',
            value:  'auth_system',
        }]
    })
    const components = answers.components

    const jellySetup = {
        useFrontend: _(components).includes('frontend'),
        useBackend: _(components).includes('routes')
    }

    fs.writeFileSync(`${process.cwd()}/jelly.yaml`, yaml.dump(jellySetup))


    // Copy boilerplate
    console.log('Copying boilerplate ...')
    // Copy root files
    copyFiles({
        files: {
            'index.js':         'index.js',
            'knexfile.js':      'knexfile.js',
            '.gitignore':       '.gitignore.sample',
            '.env.sample':      '.env.sample',
            '.env':             '.env.sample',
            '.env.test':        '.env.sample',
            '.editorconfig':    '.editorconfig',
            '.eslintrc.yml':    '.eslintrc.yml',
        }
    })

    // Install Yarn dependencies
    console.log('Installing yarn dependencies ...')
    installYarnDeps([
        'bluebird',
        'body-parser',
        'compression',
        'dotenv',
        'express',
        'jellyapp',
        'morgan',
    ])
    installYarnDeps([
        'eslint',
        'nodemon'
    ], 'dev')

    // Update package scripts
    updatePkgScripts({
        dev:        'export NODE_ENV=development && nodemon --inspect index.js',
        start:      'node index.js',
    })


    // Make frontend with addClient
    if (jellySetup.useFrontend) {
        addClient(_(components).includes('static_pug'))
    }
    // Make backend with addBAckend
    if (jellySetup.useBackend) {
        addBackend(_(components).includes('auth_system'))
    }

    // Init git
    exec('git init && git add . && git commit -m"Init commit"')
}


module.exports = initProject
