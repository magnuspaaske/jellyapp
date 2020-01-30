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

    let file = fs.readFileSync(origin, 'utf8')

    _(settings).each((val, key) => {
        const snakeKey = _.snakeCase(key).toUpperCase()
        file = file.replace(new RegExp(`{${snakeKey}}`, 'g'), val)
    })

    fs.writeFileSync(destination, file)
}

const copyFiles = ({
    files = null,
    settings = {}
} = {}) => {
    if (typeof files !== 'object') {
        const txt = 'files must be set as an object before copyFiles works'
        throw new Error(txt)
    }

    _(files).each((val, key) => {
        copyFile({
            originLocation: `boilerplate/${val}`,
            destinationLocation: key,
            settings,
        })
    })
}

module.exports = {
    copyFile,
    copyFiles,
}
