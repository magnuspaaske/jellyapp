#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs')
const moment = require('moment')
const path = require('path')

const cwd = process.cwd()

commander.version('0.3.2')

commander
    .command('makeUserMigration')
    .description('Adds the migration file for the user and session tables')
    .action(() => {
        // Read file from in migrations folder
        console.log('Creating migration for user and session tables')

        // Figuring out if migration folder exists
        const migrationFolder = `${cwd}/migrations`
        if (!(
            fs.existsSync(migrationFolder) &&
            fs.lstatSync(migrationFolder).isDirectory()
        )) {
            fs.mkdirSync(migrationFolder)
        }

        // Adding migration file
        const migrationLocation = path.join(__dirname, '../migrations/addUserSessionTables.js')
        const migration = fs.readFileSync(migrationLocation)
        const now = moment().format('YYYYMMDDhhmmss')
        const newFileName = `${now}_addUserSessionTables.js`

        fs.writeFileSync(`${migrationFolder}/${newFileName}`, migration)

        console.log(`Made migration and saved it at ./migrations/${newFileName}`)
    })


commander.parse(process.argv)
