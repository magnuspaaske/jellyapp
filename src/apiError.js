const Promise = require('bluebird')

class APIError extends Error {
    constructor (code, message, data) {
        super(message)
        this.code = code
        this.title = message
        this.name = 'APIError'
        this.data = data
        this.isApiError = true
    }
}

APIError.promise = (code, message, data) => {
    return Promise.reject(new APIError(code, message, data))
}

module.exports = APIError
