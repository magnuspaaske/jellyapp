// Middleware to ensure params are available on req.body and files on req.files

const bodyParser    = require('body-parser')
const cookieParser  = require('cookie-parser')
// const cors          = require('cors')
const fileupload    = require('express-fileupload')


// TODO: make settings

module.exports = (app) => {

    // Handling body
    app.use(bodyParser.urlencoded({
        extended: false,
    }))
    app.use(bodyParser.json({
        // Make rawBody available too
        verify: (req, res, buf, encoding) => {
            if (buf && buf.length) {
                req.rawBody = buf.toString(encoding || 'utf8')
            }
        }
    }))

    // Handling cookies
    app.use(cookieParser())

    // Handling fileupload
    app.use(fileupload({
        highWaterMark: 2 * 1024 * 1024,
        limits: {
            fileSize: 10 * 1024 * 1024
        },
        abortOnLimit: true,
    }))
}
