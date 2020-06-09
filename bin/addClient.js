// Set up a client for a project

const _ = require('lodash')
const { execSync } = require('child_process')
const fs = require('fs')
// const path = require('path')

const pkg = require('../package.json')
const {
    copyFile,
    copyFiles,
} = require('./copyFileToProject')

const cwd = process.cwd()


const addClient = (standAlone = false) => {
    console.log('Copying boilerplate project ...')

    // Copying main files

    copyFiles({
        files: [
            'root_files/robots.txt',
            'scripts/main.coffee',
            'styles/general.sass',
        ].map((f) => `client/${f}`),
    })
    copyFiles({
        files: ['pipeline.js']
    })

    const layoutFiles = [
        'footer-js',
        'header-styles',
        'layout',
    ].map((f) => `layouts/${f}.pug`)

    console.log('Adding client files')

    if (standAlone) {
        // Put layout in the client folder etc
        copyFiles({
            files: layoutFiles,
            settings: {
                root: 'client'
            }
        })
        copyFile({
            originLocation: 'boilerplate/pages/home.pug',
            destinationLocation: 'client/static_pug/index.pug',
        })
    } else {
        // Put layout + templates in special folders for that
        copyFiles({
            files: layoutFiles,
            settings: {
                root: 'views'
            },
        })
        copyFile({
            originLocation: 'boilerplate/pages/home.pug',
            destinationLocation: 'views/pages/home.pug',
        })
    }

    console.log('Installing yarn dependencies');
    let frontendDeps = Object.keys(pkg.frontendDependencies)
    execSync('yarn add ' + frontendDeps.join(' '))
    console.log('Installed Yarn dependencies')

    // TODO: Sharpen section
    // TODO: Make own function
    // NOTE: Copyed from initProject
    // Adding scripts to package
    const projectPkg = JSON.parse(fs.readFileSync(`${cwd}/package.json`), 'utf8')

    console.log('Setting up scripts')
    const gulpScript = 'gulp --gulpfile ./node_modules/jellyapp/src/gulpfile.js --cwd .'
    const scripts = {
        'dev-fe':       `export NODE_ENV=development && yarn delete-tmp && ${gulpScript}`,
        'build':        `export NODE_ENV=production && yarn delete-tmp && ${gulpScript} build`,
        'delete-tmp':   'rm -rf public tmp'

    }
    if (typeof projectPkg.scripts !== 'object') projectPkg.scripts = {}
    _(scripts).each((val, key) => {
        projectPkg.scripts[key] = val
    })

    console.log('Writing new package.json')
    fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(projectPkg, null, 2))
}

module.exports = addClient
