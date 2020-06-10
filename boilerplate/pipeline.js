/**
  * Pipeline defines the order CSS and JS will be concatenated or loaded when
  * building the frontend
  */

module.exports.cssFilesToInject = [ // Order of CSS files
    // 'dependencies/jellyblocks.css',
    'dependencies/*.css',
    // All
    '**/*.css',
]

module.exports.jsFilesToInject = [ // Order of JS files
    'env/**/*.js', // Load env before all else

    'dependencies/jquery.js',
    'dependencies/moment.js',
    'dependencies/lodash.js',

    // Load other dependencies/libs
    'dependencies/**/*.js',
    // 'libs/**/*.js',
    // 'templates/**/*.js',

    // Load misc so stuff can be loaded in there
    'main.js',
    '**/*.js',
]

// NPM Files are files loaded from installed NPM modules. They end up in the
//  "dependencies" folder
module.exports.npmFiles = {
    // Add jquery
    'jquery/dist/jquery.js': 'js',
    // Add lodash
    'lodash/lodash.js': 'js',
    // Add moment
    'moment/moment.js': 'js',
    // Add Jellyblocks
    // 'jellyblocks/jellyblocks.js': 'js',
    // 'jellyblocks/jellyblocks.css': 'css',
}
