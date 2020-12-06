const { assert, expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

require('dotenv').config({
    path: './test/helpers/.env'
})

const beforeHook    = require('./helpers/beforeHook')

const app = require('./helpers/testApp')
chai.use(chaiHttp)

const request = chai.request(app)


describe('User', () => {
    const tokens = {}
    before(beforeHook(tokens))

    it('sign up new user', done => {
        request
            .post('/api/v0/users')
            .send({
                email: 'user2@example.com',
                password: 'password'
            })
            .end((err, res) => {
                expect(res).to.have.status(201)
                expect(res.body.email).to.equal('user2@example.com')
                done()
            })
    })
})
