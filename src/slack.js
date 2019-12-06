// Method to send messages toslack

const Promise = require('bluebird')
const request = require('request')


module.exports.sendSlackMsg = (message, webhook) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Sending slack message')
        console.log(`Message: ${message}`)
        console.log(`Webhook: ${webhook}`)
    }
    return new Promise((resolve, reject) => request.post({
        url: webhook,
        body: JSON.stringify({
            text: message,
        }),
    }, (err, httpResponse, body) => {
        if (err) {
            return reject({
                err,
                httpResponse,
                body,
            })
        }

        return resolve(body)
    }))
}
