#!/usr/bin/env node

const _ = require('lodash')
const commander = require('commander')

const setupUsersSessions = require('./setupUsersSessions')
const initProject = require('./initProject')


commander.version('0.3.3')

commander
    .command('init')
    .description('Sets up a basic project')
    .action(() => {
        console.log('Creating the basic project')
        initProject()
    })

commander
    .command('makeUserMigration')
    .description('Adds the migration file for the user and session tables')
    .action(() => {
        console.log('Creating migration for user and session tables')
        setupUsersSessions()
    })


commander.parse(process.argv)
