// A simple function allow us to use the cached images in the templates

let assetPaths
let hasPaths

try {
    assetPaths = require(`${process.cwd()}/tmp/assets-hashes.json`)
    hasPaths = true
} catch (e) {
    hasPaths = false
}

module.exports = (path) => {
    let newPath

    // Check if we have the new paths
    if (hasPaths) {
        newPath = assetPaths[path] || path
    } else {
        newPath = path
    }

    // Check if we have a cdn
    if (process.env.CACHE_HOST) {
        newPath = process.env.CACHE_HOST + newPath
    }

    return newPath
}
