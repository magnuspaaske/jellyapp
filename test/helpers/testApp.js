const jellyApp = require('../../src/app');
const sessionMiddleware = require('../../src/sessionMiddleware');
const routing = require('../../src/routing');

// Make app
const app = jellyApp({
    useBackend: true,
});

// Set up test routes
app.use(sessionMiddleware(require('./testSessionModel')));
app.use(
    routing({
        authApiLocation: 'src/authApi',
        apiLocation: 'test/helpers/api',
        combinedApiLocation: 'test/helpers/combined-api',
        jellySetup: {
            useBackend: true,
            backend: {
                useAuth: true,
            },
        },
        UserModel: require('./testUserModel'),
        SessionModel: require('./testSessionModel'),
        security: {},
        controllerLocation: 'test/helpers/controllers',
    })
);

module.exports = app;
