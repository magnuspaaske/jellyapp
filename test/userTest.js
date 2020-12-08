const { assert, expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

require('dotenv').config({
    path: './test/helpers/.env'
})

const beforeHook    = require('./helpers/beforeHook')
const User          = require('./helpers/testUserModel')

const app = require('./helpers/testApp')
chai.use(chaiHttp)

const request = () => chai.request(app)


describe('User', () => {
    const tokens = {}
    before(beforeHook(tokens))

    describe('signup', () => {
        it('using existing email', done => {
            request()
                .post('/api/v0/users')
                .send({
                    email: 'user@example.com',
                    password: 'password'
                })
                .end((err, res) => {
                    expect(res).to.have.status(409)
                    done()
                })
        })

        it('using new email', done => {
            request()
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


    it('sign in', done => {
        request()
            .post('/api/v0/sessions')
            .send({
                email: 'user@example.com',
                password: 'password'
            })
            .end((err, res)  => {
                expect(res).to.have.status(202)
                done()
            })
    })

    it('get current user', done => {
        request()
            .get('/api/v0/users/me')
            .set('Authorization', tokens.user)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.email).to.equal('user@example.com')
                done()
            })
    })

    describe('change password', () => {
        it('getting error using wrong password', async () => {
            return request()
                .put('/api/v0/users/me/password')
                .set('Authorization', tokens.user)
                .send({
                    password:       'wrong_password',
                    new_password:   'new_password',
                })
                .then(async (res) => {
                    expect(res).to.have.status(403)

                    const user = new User({ email: 'user@example.com'})
                    await user.fetch()

                    const passwordWorking = await user.checkPassword('password')
                    expect(passwordWorking).to.equal(true)
                })
        })

        it('success using right password', async () => {
            return request()
                .put('/api/v0/users/me/password')
                .set('Authorization', tokens.user)
                .send({
                    password:       'password',
                    new_password:   'new_password',
                })
                .then(async (res) => {
                    expect(res).to.have.status(204)

                    const user = new User({ email: 'user@example.com' })
                    await user.fetch()

                    const passwordWorking = await user.checkPassword('password')
                    expect(passwordWorking).to.equal(false)
                    const newPasswordWorking = await user.checkPassword('new_password')
                    expect(newPasswordWorking).to.equal(true)
                })
        })
    })
})
