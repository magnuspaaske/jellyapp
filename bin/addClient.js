// Set up a client for a project

const fs = require('fs');
const yaml = require('js-yaml');

const { copyFile, copyFiles } = require('./copyFileToProject');
const { installYarnDeps, updatePkgScripts } = require('./util');
const { readJellyYaml, writeJellyYaml } = require('../src/jellyYaml');

const addClient = (standAlone = false) => {
    console.log('Copying boilerplate for frontend ...');

    // Copying main files

    copyFiles({
        files: [
            'root_files/robots.txt',
            'scripts/main.coffee',
            'styles/general.sass',
        ].map((f) => `client/${f}`),
    });
    copyFiles({
        files: ['pipeline.js'],
    });

    const layoutFiles = ['footer-js', 'header-styles', 'layout'].map(
        (f) => `layouts/${f}.pug`
    );

    console.log('Adding client files ...');

    if (standAlone) {
        // Put layout in the client folder etc
        copyFiles({
            files: layoutFiles,
            settings: {
                root: 'client',
            },
        });
        copyFiles({
            files: ['client/root_files/_redirects'],
        });
        copyFile({
            originLocation: 'boilerplate/pages/home.pug',
            destinationLocation: 'client/static_pug/index.pug',
        });
    } else {
        // Put layout + templates in special folders for that
        copyFiles({
            files: layoutFiles,
            settings: {
                root: 'views',
            },
        });
        copyFile({
            originLocation: 'boilerplate/pages/home.pug',
            destinationLocation: 'views/pages/home.pug',
        });
    }

    console.log('Installing yarn dependencies for frontend ...');
    installYarnDeps([
        '@sendgrid/mail',
        'grunt',
        'grunt-bushcaster',
        'grunt-sails-linker',
        'gulp',
        'gulp-clean',
        'gulp-clean-css',
        'gulp-coffee',
        'gulp-concat',
        'gulp-modify-file',
        'gulp-pug',
        'gulp-rename',
        'gulp-replace',
        'gulp-sass',
        'gulp-uglify-es',
        'include-all',
        'jquery',
        'mjml',
        'pug',
        'replace',
        'showdown',
    ]);

    // Update package scripts
    const gulpScript =
        'gulp --gulpfile ./node_modules/jellyapp/src/gulpfile.js --cwd .';
    updatePkgScripts({
        'dev-fe': `export NODE_ENV=development && yarn delete-tmp && ${gulpScript}`,
        build: `export NODE_ENV=production && yarn delete-tmp && ${gulpScript} build`,
        'delete-tmp': 'rm -rf public tmp',
    });

    // Update jelly.yaml
    const jellyYaml = readJellyYaml();
    jellyYaml.useFrontend = true;
    jellyYaml.frontend = {
        useStatic: standAlone,
    };
    writeJellyYaml(jellyYaml);
};

module.exports = addClient;
