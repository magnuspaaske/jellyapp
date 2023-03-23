// Middleware to ensure params are available on req.body and files on req.files

// TODO: make settings

module.exports = (app, mbLimit = 1) => {
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const fileupload = require('express-fileupload');

    // Handling body
    app.use(
        bodyParser.urlencoded({
            extended: false,
            limit: `${mbLimit}mb`,
        })
    );
    app.use(
        bodyParser.json({
            // Make rawBody available too
            verify: (req, res, buf, encoding) => {
                if (buf && buf.length) {
                    req.rawBody = buf.toString(encoding || 'utf8');
                }
            },
            limit: `${mbLimit}mb`,
        })
    );

    // Handling cookies
    app.use(cookieParser());

    // Handling fileupload
    app.use(
        fileupload({
            limits: {
                fileSize: mbLimit * 1024 * 1024,
            },
            abortOnLimit: true,
        })
    );
};
