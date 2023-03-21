/**
 * Jellyapp
 * This is the boilerplate entry point to the node application. It can be edited
 *  and changed for a project as needed.
 * Keep in mind that lines starting with "//- JELLY:" are used by the Jelly CLI for
 *  to insert and edit code as needed.
 */

// Load environment for use in development or testing
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

// Load variables
require('colors');
const jelly = require('jellyapp');
const jellyYaml = jelly.readConfig();

// Separate instances when running with nodemon
console.log('');
console.log('--- --- --- --- --- --- --- --- --- --- --- ---'.grey);

// Making app
const app = jelly.app();

// Send static files from /public
app.use(
    require('express').static(__dirname + '/public', {
        maxAge:
            process.env.NODE_ENV === 'production'
                ? 365 * 24 * 60 * 60 * 1000
                : 0,
        setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
        },
    })
);

if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('tiny'));
}

if (jellyYaml.useBackend) {
    if (jellyYaml.backend.useAuth) {
        app.use(jelly.sessionMiddleware(require('./app/models/sessionModel')));
        app.use(
            jelly.routing(
                require('./app/models/userModel'),
                require('./app/models/sessionModel')
            )
        );
    } else {
        app.use(jelly.routing());
    }
    if (process.env.NODE_ENV === 'development') jelly.swaggerServer(app);
}

// Hook up page routes
if (jellyYaml.useBackend && jellyYaml.useFrontend) {
    app.set('views', './views/pages');
    app.set('view engine', 'pug');

    app.use((req, res, next) => {
        res.locals.useAsset = jelly.useAsset;
        next();
    });

    // Allow us to test emails
    if (process.env.NODE_ENV === 'development') {
        // app.use('/test', require('./app/pageControllers/testController'))
    }
}

// Send html if page is static
if (jellyYaml.useFrontend && jellyYaml.frontend.useStatic) {
    app.use(jelly.serveStatic());
}

// Send hello world if index route hasn't been claimed yet
app.get('/', function (req, res) {
    res.send('hello world');
});

// Start server
app.listen(app.get('port'), () => {
    console.log(`Node app is running on port ${app.get('port')}`.grey);
});

module.exports = app;
