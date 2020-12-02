// Show the API documentation

const fs = require('fs')
const yaml = require('js-yaml')
const swaggerUI = require('swagger-ui-express')


const swaggerServer = (app, route = '/api-docs') => {
    const swaggerDocument = yaml.safeLoad(fs.readFileSync('./api.yaml', 'utf8'))
    app.use(route, swaggerUI.serve, swaggerUI.setup(swaggerDocument))
}

module.exports = swaggerServer
