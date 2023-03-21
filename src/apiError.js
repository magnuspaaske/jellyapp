const Promise = require('bluebird');

class APIError extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.title = message;
        this.name = 'APIError';
        this.data = data;
    }
}

module.exports = APIError;
