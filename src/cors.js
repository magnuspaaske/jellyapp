// Module to allow CORS requests

const _ = require('lodash');

// TODO: Make settings object to finetune CORS behavior
module.exports = (app) => {
    app.use(require('cors')());

    app.use((req, res, next) => {
        const origin = req.headers.origin;

        // Check if no CORS
        if (!origin || origin === process.env.PAGE_ORIGIN) {
            next();
            return;
        }

        if (typeof process.env.CORS_DOMAINS === 'string') {
            const protoWhiteList = process.env.CORS_DOMAINS.split(';');
            const whitelist = [];

            _.each(protoWhiteList, (domain) => {
                whitelist.push(`http://${domain}`);
                whitelist.push(`http://${domain}/`);
                whitelist.push(`https://${domain}`);
                whitelist.push(`https://${domain}/`);
            });

            // const isProdEnv = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
            const isPostman = req.get('Postman-Token');

            if (isPostman || _(whitelist).includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
                next();
                return;
            }
        }
        res.status(403).send(`CORS error. Origin not allowed: ${origin}`);
    });
};
