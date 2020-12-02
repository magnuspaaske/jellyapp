/**
 * Jellyapp
 * This is the boilerplate to create a CRUD controller for a specified model
 *  and was created with the Jelly CLI.
 * The file can safely be edited
 * All exported functions will be available to the API
 */

// Basic imports
const Promise = require('bluebird')
const moment = require('moment')

const {
    APIError,
    apiHandler,
    auth,
} = require('jellyapp')

// Import models needed
const {MODELNAME_CAP} = require('../models/{MODELNAME_UNCAP}Model')
const {MODELNAME_CAP}Collection = require('../collections/{MODELNAME_UNCAP}Collection')



exports.get{MODELNAME_PLURAL_CAP} = (req, res, next) => res.sendStatus(501)

exports.get{MODELNAME_CAP} = (req, res, next) => res.sendStatus(501)

exports.make{MODELNAME_CAP} = (req, res, next) => res.sendStatus(501)

exports.update{MODELNAME_CAP} = (req, res, next) => res.sendStatus(501)

exports.delete{MODELNAME_CAP} = (req, res, next) => res.sendStatus(501)
