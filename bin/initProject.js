// Set up a project at the beginning

const _ = require('lodash')
const { execSync } = require('child_process');

const package = require('../package.json')
const copyFileToProject = require('./copyFileToProject')

const initProject = () => {
    // Copy root files
    const files = [
        'index.js',
        'knexfile.js',
        '.gitignore',
        '.env.sample',
        '.editorconfig',
    ]

    _(files).each((val, key) => {
        copyFileToProject({
            originLocation: `boilerplate/${val}`,
            destinationLocation: val
        })
    })
    copyFileToProject({
        originLocation: 'boilerplate/.env.sample',
        destinationLocation: '.env'
    })

    console.log('Copied boilerplate files for the project');

    // Install Yarn dependencies
    let deps = Object.keys(package.peerDependencies)
    execSync('yarn add ' + deps.join(' '))

    console.log('Installed Yarn dependencies');
}


module.exports = initProject()
