#!/usr/bin/env node

// const _ = require('lodash')
require('colors')

const fs = require('fs')

const commander = require('commander')

const addClient = require('./addClient')
const addModel = require('./addModel')
const setupUsersSessions = require('./setupUsersSessions')
const initProject = require('./initProject')

const pkg = require('../package.json')

commander.version(pkg.version)


commander
    .command('init <folder>')
    .description('Sets up a basic project')
    .action((folder) => {
        console.log('Setting up a Jelly Project')
        // Switch folder
        if (folder === '.') {
            initProject()
        } else if (fs.existsSync(`./${folder}`)) {
            console.log(`./${folder} folder already exists`.red)
        } else {
            fs.mkdirSync(`./${folder}`)
                process.chdir(`./${folder}`)
            console.log('current folder')
            console.log(process.cwd())
            initProject()
        }

    })


commander
    .command('addClient')
    .alias('addFrontend')
    .description('Adds a frontend to a project')
    .option('--stand-alone', 'use jelly to set up a stand alone frontend', false)
    .action((opts) => {
        if (opts.standAlone) {
            console.log('Setting up stand alone client')
        } else {
            console.log('Setting up frontend for project')
        }
        addClient(opts.standAlone)
    })


commander
    .command('addBackend')
    .description('Adds a backend to a project')
    .option('--use-auth', 'use the authentication module', true)
    .action((opts) => {
        console.log('backend setup')
        console.log(opts)
    })


commander
    .command('addUserSessions')
    .description('Adds everything needed for adding users and sessions')
    .action(() => {
        console.log('Creating migration for user and session tables')
        setupUsersSessions()
    })


commander
    .command('addModel <modelName>')
    .alias('makeModel')
    .description('Adding a model to the project')
    .option('--no-crud', 'don\'t add router to new model', false)
    .option('--plural <plural>', 'name for plural version of model', null)
    .action((modelName, opts) => {
        console.log(`Adding model: ${modelName}`)
        addModel({
            modelName,
            pluralName: opts.plural,
            router: opts.crud,
        })
    })


commander.parse(process.argv)
