/**
 * Jellyapp
 * This is the boilerplate to create a CRUD API for a specified model
 *  and was created with the Jelly CLI.
 * The file can safely be edited
 */


// Basic imports
const Promise = require('bluebird')
const moment = require('moment')

const {
    APIError,
    apiHandler,
    auth,
} = require('jellyapp')

const router = require('express').Router()


// Import models needed
const {MODELNAME_CAP} = require('../models/{MODELNAME_UNCAP}Model')
const {MODELNAME_CAP}Collection = require('../collections/{MODELNAME_UNCAP}Collection')


// Auth to find the model being worked on and add it to the req object
// Jelly @todo: Don't forget to add your own ACL logic on top of the auth logic
const {MODELNAME_UNCAP}Auth = [auth(), apiHandler((req, res, next) => {
    return new {MODELNAME_CAP}({
        id: req.params.{MODELNAME_UNCAP}_id
    })
    .fetch()
    .catch(() => {
        throw new APIError(404, '{MODELNAME_CAP} not found')
    })
    .then({MODELNAME_UNCAP} => {
        req.{MODELNAME_UNCAP} = {MODELNAME_UNCAP}
        return next()
    })
})]


// GET action for specific model
router.get('/{MODELNAME_PLURAL}/:{MODELNAME_UNCAP}_id',
    {MODELNAME_UNCAP}Auth,
    apiHandler((req, res) => {
        res.send(req.{MODELNAME_UNCAP})
    })
)

// GET action for all models of this type
router.get('/{MODELNAME_PLURAL}',
    auth(),
    apiHandler((req, res) => {
        return new {MODELNAME_CAP}Collection()
            .fetch()
            .then(({MODELNAME_PLURAL}) => {
                res.send({MODELNAME_PLURAL})
            })
    })
)


// POST Action
router.post('/{MODELNAME_PLURAL}',
    auth(),
    apiHandler((req, res) => {
        // Jelly @todo: Don't forget to implement checks on the posted data
        return new {MODELNAME_CAP}({
            ...req.body,
        })
            .save()
            .then(({MODELNAME_UNCAP}) => {
                res.send({MODELNAME_UNCAP})
            })
    })
)


// PUT Action
router.put('/{MODELNAME_PLURAL}/:{MODELNAME_UNCAP}_id',
    {MODELNAME_UNCAP}Auth,
    apiHandler((req, res) => {
        // Jelly @todo: Don't forget to implement checks on the putted data
        return req.{MODELNAME_UNCAP}.save({
            ...req.body
        })
            .then(({MODELNAME_UNCAP}) => {
                res.send({MODELNAME_UNCAP})
            })
    })
)


// DELETE Action
router.delete('/{MODELNAME_PLURAL}/:{MODELNAME_UNCAP}_id',
    {MODELNAME_UNCAP}Auth,
    apiHandler((req, res) => {
        // Jelly @todo: Don't forget to implement any delete checks/actions before deleting
        return req.{MODELNAME_UNCAP}.destroy()
            .then(res.sendStatus(202))
    })
)


module.exports = router
