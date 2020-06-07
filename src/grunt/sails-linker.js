/*
 * Link CSS and JS assets in the 'layout' file
 */

module.exports = function(grunt) {

    grunt.setCorrectDir()
    const pipeline = require(`${process.cwd()}/pipeline.js`)

    // Activate when ready to go
    const prodCss = () => {
        return ['public/styles.min-[a-z0-9][a-z0-9]*.css']
    }
    const prodJs = () => {
        return ['public/scripts.min-[a-z0-9][a-z0-9]*.js']
    }

    grunt.config.set('sails-linker', {
        devJs: {
            options: {
                startTag: '//- SCRIPTS',
                endTag: '//- SCRIPTS END',
                fileTmpl: `script(src="${process.env.BASE_ASSET_URL || ''}/%s", type="text/javascript")`,
                appRoot: 'public/'
            },
            files: {
                './views/**/*.pug': pipeline.jsFilesToInject.map(path => {
                    return 'public/scripts/' + path
                }),
            }
        },
        prodJs: {
            options: {
                startTag: '//- SCRIPTS',
                endTag: '//- SCRIPTS END',
                fileTmpl: `script(type="text/javascript", src="${(process.env.CACHE_HOST || '')}/%s")`,
                appRoot: 'public/'
            },
            files: {
                './views/**/*.pug': prodJs()
            }
        },
        devCss: {
            options: {
                startTag: '//- STYLES',
                endTag: '//- STYLES END',
                fileTmpl: `link(rel="stylesheet", href="${process.env.BASE_ASSET_URL || ''}/%s")`,
                appRoot: 'public/'
            },
            files: {
                './views/**/*.pug': pipeline.cssFilesToInject.map(path => {
                    return 'public/styles/' + path
                }),
            }
        },
        prodCss: {
            options: {
                startTag: '//- STYLES',
                endTag: '//- STYLES END',
                fileTmpl: `link(rel="stylesheet", href="${(process.env.CACHE_HOST || '')}/%s")`,
                appRoot: 'public/'
            },
            files: {
                './views/**/*.pug': prodCss()
            }
        }
    })

    grunt.loadNpmTasks('grunt-sails-linker')
}
