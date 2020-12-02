/**
 * Jellyapp
 * This is the boilerplate entry point to the node application. It can be edited
 *  and changed for a project as needed.
 * Keep in mind that lines starting with "//- JELLY:" are used by the Jelly CLI for
 *  to insert and edit code as needed.
 */


// Load environment for use in development or testing
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
} else if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({
        path: './.env.test'
    })
}


// Load variables
require('colors')
const jelly = require('jellyapp')
const jellyYaml = jelly.readConfig()


// Separate instances when running with nodemon
console.log('')
console.log('--- --- --- --- --- --- --- --- --- --- --- ---'.grey)


// Making app
const app = jelly.app()

// Send static files from /public
app.use(
    require('express').static(__dirname + '/public', {
        setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
        }
    })
)

app.use(require('morgan')('tiny'))


if (jellyYaml.useBackend) {
    app.use(jelly.routing())
    if (process.env.NODE_ENV === 'development') jelly.swaggerServer(app)
}


// Hook up page routes


// Send html if page is static
if (jellyYaml.useFrontend && jellyYaml.frontend.useStatic) {
    app.use(jelly.serveStatic())
}


// Send hello world if index route hasn't been claimed yet
app.get('/', function (req, res) {
    res.send('hello world')
})


// Start server
app.listen(app.get('port'), () => {
    console.log(`Node app is running on port ${app.get('port')}`.grey)
})
