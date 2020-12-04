// Routing requests based on the docker config

const _         = require('lodash')
const fs        = require('fs')
const yaml      = require('js-yaml')
const express   = require('express')

const SwaggerParser = require('swagger-parser')
const { connector } = require('swagger-routes-express')

// const APIError          = require('./apiError')
const auth              = require('./auth')
const { readJellyYaml } = require('./jellyYaml')
const sessionController = require('./sessionController')
const userController    = require('./userController')


const swaggerRouting = (User, Session) => {
    const jellySetup = readJellyYaml()
    let swaggerDocument


    if (jellySetup.backend.useAuth) {
        swaggerDocument = _.merge(
            yaml.safeLoad(fs.readFileSync(`${process.cwd()}/node_modules/jellyapp/src/authApi.yaml`, 'utf8')),
            yaml.safeLoad(fs.readFileSync(`${process.cwd()}/api.yaml`, 'utf8'))
        )
    } else {
        // Read specs
        swaggerDocument = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/api.yaml`, 'utf8'))
    }

    // Test specs
    SwaggerParser.validate(swaggerDocument, (err, api) => {
        if (err) {
            console.error("Swagger document has errors")
            throw err
        }
        console.log("API name: %s, Version: %s", api.info.title, api.info.version)
    })

    // Write out full api
    if (jellySetup.backend.useAuth) {
        fs.writeFileSync(
            `${process.cwd()}/combined-api.yaml`,
            yaml.safeDump(swaggerDocument)
        )
    }

    // Add route for docs
    const router = express.Router()

    // Get controllers
    const controllers = {}
    const options = {}
    if (jellySetup.backend.useAuth) {
        Object.assign(controllers,
            sessionController(User, Session),
            userController(User),
        )
        options.security = {
            auth:       auth(),
            adminAuth:  auth({admin: true})
        }
    }
    fs.readdirSync(`${process.cwd()}/app/controllers`).forEach(file => {
        const controller = require(`${process.cwd()}/app/controllers/${file}`)
        Object.assign(controllers, controller)
    })

    // Add routes
    const connect = connector(controllers, swaggerDocument, options)
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
