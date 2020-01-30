#!/usr/bin/env node

// const _ = require('lodash')
require('colors')

const commander = require('commander')

const setupUsersSessions = require('./setupUsersSessions')
const initProject = require('./initProject')

const pkg = require('../package.json')

commander.version(pkg.version)

commander
    .command('init')
    .description('Sets up a basic project')
    .action(() => {
        console.log('Setting up a Jelly Project')
        initProject()
    })

commander
    .command('addUserSessions')
    .description('Adds everything needed for adding users and sessions')
    .action(() => {
        console.log('Creating migration for user and session tables')
        setupUsersSessions()
    })


commander.parse(process.argv)
