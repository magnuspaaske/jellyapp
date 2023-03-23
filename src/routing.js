// Routing requests based on the docker config

const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const express = require('express');

const SwaggerParser = require('swagger-parser');
const { connector } = require('swagger-routes-express');

// const APIError          = require('./apiError')
const auth = require('./auth');
const { readJellyYaml } = require('./jellyYaml');
const sessionController = require('./sessionController');
const userController = require('./userController');

const swaggerRouting = ({
    authApiLocation = 'node_modules/jellyapp/src/authApi',
    apiLocation = 'api',
    combinedApiLocation = 'combined-api',
    jellySetup = readJellyYaml(),
    UserModel = require(`${process.cwd()}/app/models/userModel`),
    SessionModel = require(`${process.cwd()}/app/models/sessionModel`),
    security = {},
    controllerLocation = 'app/controllers',
} = {}) => {
    let swaggerDocument;

    if (jellySetup.backend.useAuth) {
        swaggerDocument = _.merge(
            yaml.load(
                fs.readFileSync(
                    `${process.cwd()}/${authApiLocation}.yaml`,
                    'utf8'
                )
            ),
            yaml.load(
                fs.readFileSync(`${process.cwd()}/${apiLocation}.yaml`, 'utf8')
            )
        );
    } else {
        // Read specs
        swaggerDocument = yaml.load(
            fs.readFileSync(`${process.cwd()}/${apiLocation}.yaml`, 'utf8')
        );
    }

    // Test specs
    SwaggerParser.validate(swaggerDocument, (err, api) => {
        if (err) {
            console.error('Swagger document has errors');
            throw err;
        }
        console.log(
            'API name: %s, Version: %s',
            api.info.title,
            api.info.version
        );
    });

    // Write out full api
    if (jellySetup.backend.useAuth) {
        fs.writeFileSync(
            `${process.cwd()}/${combinedApiLocation}.yaml`,
            yaml.dump(swaggerDocument)
        );
    }

    // Add route for docs
    const router = express.Router();

    // Get controllers
    const controllers = {};
    const connectOptions = {};
    if (jellySetup.backend.useAuth) {
        Object.assign(
            controllers,
            sessionController(UserModel, SessionModel),
            userController(UserModel)
        );
        if (fs.existsSync(`${process.cwd()}/app/security`)) {
            fs.readdirSync(`${process.cwd()}/app/security`).forEach((file) => {
                const controller = require(`${process.cwd()}/app/security/${file}`);
                Object.assign(security, controller);
            });
        }

        connectOptions.security = Object.assign(
            {
                auth: auth(),
                adminAuth: auth({ admin: true }),
            },
            security
        );
    }

    fs.readdirSync(`${process.cwd()}/${controllerLocation}`).forEach((file) => {
        const controller = require(`${process.cwd()}/${controllerLocation}/${file}`);
        Object.assign(controllers, controller);
    });

    // Add routes
    const connect = connector(controllers, swaggerDocument, connectOptions);
    connect(router);

    // Handle errors
    router.use((err, req, res, next) => {
        if (process.env.NODE_ENV === 'development') {
            console.error(err.stack.red);
        }

        res.status(err.code || 500);

        if (err.name === 'APIError') {
            const { title, data, code, message } = err;
            if (data) {
                res.send({
                    title,
                    data,
                    code,
                });
            } else {
                res.send({
                    message,
                    code,
                });
            }
        } else {
            res.send({
                error: 'An unknown error occured',
            });
        }
    });

    return router;
};

module.exports = swaggerRouting;
