const _ = require('lodash')

const checkFieldsExist = (fields, obj) => {
    let exist = true

    _(fields).each((field) => {
        if (!obj[field]) exist = false

    })
    return exist
}

module.exports = checkFieldsExist
