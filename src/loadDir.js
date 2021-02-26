// src/loadDir
// Load all files from a directory into a folder

const fs = require('fs')


const loadDir = (dir) => {
    const obj = {}
    fs.readdirSync(`${process.cwd()}/${dir}`).forEach(file => {
        const fileContents = require(`${process.cwd()}/${dir}/${file}`)
        if (typeof fileContents === 'object') {
            Object.assign(obj, fileContents)
        } else {
            obj[file.replace(/\.js$/, '')] = fileContents
        }
    })
}

module.exports = loadDir
