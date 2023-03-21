// Replace file references for assets in CSS and JS before building

const replace = require('replace');
const fs = require('fs');

module.exports = (grunt) => {
    grunt.config.set('bushcaster', {
        assets: {
            options: {
                hashLength: 14,
                noProcess: true,
                requirejs: false,
                onComplete: (rawmap = {}, files) => {
                    const map = {};

                    // Where we update the references
                    const filesToUpdate = ['tmp/scripts.js', 'tmp/styles.css'];

                    Object.entries(rawmap)
                        .reverse()
                        .map((arr) => {
                            const key = arr[0].replace('../../public/', '/');
                            const val = arr[1].replace('../../public/', '/');
                            map[key] = val;

                            // Updating reference to asset
                            replace({
                                regex: key,
                                replacement: val,
                                paths: filesToUpdate,
                                recursive: true,
                                silent: true,
                            });
                        });

                    fs.writeFileSync(
                        'tmp/assets-hashes.json',
                        JSON.stringify(map)
                    );
                },
            },
            files: [
                {
                    expand: true,
                    cwd: './tmp/copies/',
                    src: ['./**/*'],
                    dest: '../../public/',
                },
            ],
        },
        prodJs: {
            options: {
                hashLength: 14,
                noProcess: true,
                requirejs: false,
            },
            files: [
                {
                    expand: true,
                    cwd: './tmp/',
                    src: ['./scripts.min.js'],
                    dest: '../public/',
                },
            ],
        },
        prodCss: {
            options: {
                hashLength: 14,
                noProcess: true,
                requirejs: false,
            },
            files: [
                {
                    expand: true,
                    cwd: './tmp/',
                    src: ['./styles.min.css'],
                    dest: '../public/',
                },
            ],
        },
    });

    grunt.loadNpmTasks('grunt-bushcaster');
};
