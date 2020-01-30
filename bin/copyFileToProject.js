// Copy a file from the boilerplate into the project

const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const cwd = process.cwd()


const copyFile = ({
    originLocation = null,
    destinationLocation = null,
    settings = {},
} = {}) => {
    // Ensuring origin and destination are set
    if (!originLocation || !destinationLocation) {
        const txt = 'originLocation and destinationLocation must be set before copyFile works'
        throw new Error(txt)
    }

    const destination = `${cwd}/${destinationLocation}`
    const origin = path.join(__dirname, `../${originLocation}`)

    // Ensuring directory is created
    fs.mkdirSync(path.dirname(destination), {
        recursive: true,
    })

    let file = fs.readFileSync(origin)

    _(settings).each((val, key) => {
        const snakeKey = _.snakeCase(key).toUpperCase()
        file = file.replace(new RegExp(`{${snakeKey}}`, 'g'), val)
    })

    fs.writeFileSync(destination, file)
}

module.exports = copyFile
