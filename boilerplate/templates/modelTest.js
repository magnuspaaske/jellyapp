const { assert, expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

// Set node env
require('dotenv').config({
    path: './.env.test'
})

const beforeHook = require('./helpers/beforeHook')
const {MODELNAME_CAP} = require('../app/models/{MODELNAME_UNCAP}Model')

const app = require('../index')
chai.use(chaiHttp)

const request = chai.request(process.env.PAGE_ORIGIN)


describe('{MODELNAME_CAP}', () => {
    before(beforeHook())

    it('get {MODELNAME_CAP} by id', done => {
        // Code
    })
})
