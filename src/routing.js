// Routing requests based on the docker config

const fs = require('fs')
const yaml = require('js-yaml')
const express = require('express')

const SwaggerParser = require('swagger-parser')
const { connector } = require('swagger-routes-express')

const APIError = require('./apiError')


const swaggerRouting = () => {
    // Read specs
    const swaggerDocument = yaml.safeLoad(fs.readFileSync('./api.yaml', 'utf8'))

    // Test specs
    SwaggerParser.validate(swaggerDocument, (err, api) => {
        if (err) {
            console.error("Swagger document has errors")
            throw err
        }
        console.log("API name: %s, Version: %s", api.info.title, api.info.version)
    })

    // Add route for docs
    const router = express.Router()

    // Get controllers
    const controllers = {}
    fs.readdirSync(`${process.cwd()}/app/controllers`).forEach(file => {
        const controller = require(`${process.cwd()}/app/controllers/${file}`)
        Object.assign(controllers, controller)
    })

    // Add routes
    const connect = connector(controllers, swaggerDocument)
    connect(router)

    // Handle errors
    router.use((err, req, res, next) => {
        if (process.env.NODE_ENV === 'development') {
            console.error(err.stack.red)
        }

        res.status(err.code || 500)

        if (err.isApiError) {
            const { title, data, code, message } = err
            if (data) {
                res.send({
                    title, data, code
                })
            } else {
                res.send({
                    message, code
                })
            }
        } else {
            res.send({
                error: 'An unknown error occured'
            })
        }
    })

    return router
}

module.exports = swaggerRouting
