// src/renderEmail
// A service to render an email before sending it. CSS is automatically inlined

const fs        = require('fs')
const Promise   = require('bluebird')

const inlineCss = require('inline-css')
const pug       = require('pug')
const mjml2html = require('mjml')

// pug Fns for locals
const pugFns = require('./pug-fns')


const renderEmail = async (template, locals) => {
    const tmp = pug.compileFile(`${process.cwd()}/views/emails/${template}.pug`)
    const mjml = await tmp(Object.assign({}, pugFns, locals))

    const rawHtml = mjml2html(mjml, {

    }).html

    return rawHtml
}


module.exports = renderEmail
