/*
 * Link CSS and JS assets in the 'layout' file
 */

module.exports = function (grunt) {
    grunt.setCorrectDir();
    const pipeline = require(`${process.cwd()}/pipeline.js`);

    grunt.config.set('sails-linker', {
        devJs: {
            options: {
                startTag: '//- SCRIPTS',
                endTag: '//- SCRIPTS END',
                fileTmpl: `script(src="${
                    process.env.BASE_ASSET_URL || ''
                }/%s", type="text/javascript")`,
                appRoot: 'public/',
            },
            files: {
                './**/*.pug': pipeline.jsFilesToInject.map((path) => {
                    return 'public/scripts/' + path;
                }),
            },
        },
        prodJs: {
            options: {
                startTag: '//- SCRIPTS',
                endTag: '//- SCRIPTS END',
                fileTmpl: `script(type="text/javascript", src="${
                    process.env.CACHE_HOST || ''
                }/%s")`,
                appRoot: 'public/',
            },
            files: {
                './**/*.pug': ['public/scripts.min-[a-z0-9][a-z0-9]*.js'],
            },
        },
        devCss: {
            options: {
                startTag: '//- STYLES',
                endTag: '//- STYLES END',
                fileTmpl: `link(rel="stylesheet", href="${
                    process.env.BASE_ASSET_URL || ''
                }/%s")`,
                appRoot: 'public/',
            },
            files: {
                './**/*.pug': pipeline.cssFilesToInject.map((path) => {
                    return 'public/styles/' + path;
                }),
            },
        },
        prodCss: {
            options: {
                startTag: '//- STYLES',
                endTag: '//- STYLES END',
                fileTmpl: `link(rel="stylesheet", href="${
                    process.env.CACHE_HOST || ''
                }/%s")`,
                appRoot: 'public/',
            },
            files: {
                './**/*.pug': ['public/styles.min-[a-z0-9][a-z0-9]*.css'],
            },
        },
    });

    grunt.loadNpmTasks('grunt-sails-linker');
};
