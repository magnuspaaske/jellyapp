// A wrapper to handle requests


const handler = (sendError) => {
    // The function that wraps the functions
    return (fn, context) => {
        // The callback function when a controller encounters an error
        return (req, res, next) => {
            return fn.call(context, req, res, next)
                .catch((err) => {
                    if (err.name === 'APIError') {
                        if (err.data) {
                            sendError(res, err.code, {
                                message:    err.title,
                                data:       err.data
                            })
                        } else {
                            sendError(res, err.code, err.title)
                        }
                    } else if (
                        process.env.NODE_ENV !== 'development' &&
                        !res.headersSent
                    ) {
                        sendError(res, 500)
                    } else {
                        console.log('Caught error')
                        console.error(err)
                        throw err
                    }
                })
        }
    }
}


const apiHandler = handler((res, code, obj = {}) => {
    res.status(code || 500)

    if (typeof obj === 'string') {
        res.send({
            error: obj
        })
    } else if (typeof obj === 'object'){
        res.send(obj.data)
    } else {
        res.send({
            error: 'There was an error'
        })
    }
})

const pageHandler = handler((res, code, obj = {}) => {
    res.status(code || 500)

    if (!obj.title) {
        switch (code) {
        case 404:
            obj.title = '404-not-found'
            break
        default:
            obj.title = '500-internal-error'
            break
        }
    }

    res.render('error-page', {
        code,
        error: obj.title
    })
})


module.exports = {
    handler,
    apiHandler,
    pageHandler,
}
