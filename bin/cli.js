#!/usr/bin/env node

const commander = require('commander')

const setupUsersSessions = require('./setupUsersSessions')


commander.version('0.3.3')

commander
    .command('makeUserMigration')
    .description('Adds the migration file for the user and session tables')
    .action(() => {
        console.log('Creating migration for user and session tables')
        setupUsersSessions()
    })


commander.parse(process.argv)
