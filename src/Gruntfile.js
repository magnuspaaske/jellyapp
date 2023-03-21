// Import
const bushcaster = require('./grunt/bushcaster');
const sailsLinker = require('./grunt/sails-linker');

module.exports = (grunt) => {
    grunt.setCorrectDir = () => {
        // Change to correct dir
        if (/node_modules\/jellyapp\/src$/.test(process.cwd())) {
            process.chdir('../../../');
        }
    };

    grunt.setCorrectDir();

    bushcaster(grunt);
    sailsLinker(grunt);
};
