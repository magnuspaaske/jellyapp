/**
 * Jellyapp
 * This is the boilerplate for a Jelly collection. The code is created with the
 *  Jelly CLI and can safely be edited
 */


// app/collections/{MODELNAME_UNCAP}Collection

const {
    baseCollection,
} = require('jellyapp')

module.exports = baseCollection('{MODELNAME_CAP}Collection',
    require('../models/{MODELNAME_UNCAP}Model'),
)
