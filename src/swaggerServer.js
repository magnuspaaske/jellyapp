// Show the API documentation

const fs        = require('fs')
const yaml      = require('js-yaml')
const swaggerUI = require('swagger-ui-express')


const swaggerServer = (app, route = '/api-docs') => {
    const apiLocation = fs.existsSync('combined-api.yaml') ? 'combined-api' : 'api'

    const swaggerDocument = yaml.load(fs.readFileSync(`./${apiLocation}.yaml`, 'utf8'))
    app.use(route, swaggerUI.serve, swaggerUI.setup(swaggerDocument))
}

module.exports = swaggerServer
