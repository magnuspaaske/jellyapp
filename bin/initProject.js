// Set up a project at the beginning

const _ = require('lodash')
const { execSync } = require('child_process')
const fs = require('fs')
// const path = require('path')


const pkg = require('../package.json')
const copyFileToProject = require('./copyFileToProject')

const cwd = process.cwd()

const initProject = () => {
    console.log('Copying boilerplate ...')
    // Copy root files
    const files = {
        'index.js':         'index.js',
        'knexfile.js':      'knexfile.js',
        '.gitignore':       '.gitignore.sample',
        '.env.sample':      '.env.sample',
        '.env':             '.env.sample',
        '.editorconfig':    '.editorconfig',
        '.eslint.yml':      '.eslint.yml'
    }

    _(files).each((val, key) => {
        copyFileToProject({
            originLocation: `boilerplate/${val}`,
            destinationLocation: key
        })
    })
    copyFileToProject({
        originLocation: 'boilerplate/.env.sample',
        destinationLocation: '.env'
    })

    console.log('Copied boilerplate files for the project')

    // Install Yarn dependencies
    console.log('Installing yarn dependencies ...')
    let deps = Object.keys(pkg.peerDependencies || {})
    execSync('yarn add ' + deps.join(' '))

    let devDeps = Object.keys(pkg.optionalDependencies)
    execSync('yarn add --dev ' + devDeps.join(' '))

    // TODO: Sharpen section
    // Adding scripts to package
    const scripts = {
        dev:        'export NODE_ENV=development && nodemon --inspect index.js',
        migrate:    'knex migrate:latest',
        start:      'node index.js',
    }
    const projectPkg = JSON.parse(fs.readFileSync(`${cwd}/package.json`))
    if (typeof projectPkg.scripts !== 'object') projectPkg.scripts = {}
    _(scripts).each((val, key) => {
        projectPkg.scripts[key] = val
    })
    fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(projectPkg, null, 2))

    console.log('Installed Yarn dependencies')
}


module.exports = initProject
