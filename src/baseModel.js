// A bookshelf model that can be extended
const _ = require('lodash')

const bookshelf = require('./bookshelf')


module.exports = (modelName, tableName, props, staticProps) => {
    const model = bookshelf.model(modelName, Object.assign({
        serialize (options = {}) {
            // Delete sensitive fields from output
            const attributes = bookshelf.Model.prototype.serialize.call(this, options)
            if (typeof this.sensitiveFields === 'function') {
                return _.omit(attributes, this.sensitiveFields())
            }
            return attributes
        },
    }, {
        tableName,
        hasTimestamps: true,
        ...props
    }))

    if ((typeof staticProps) === 'object') {
        _(staticProps).each((fun, key) => {
            model[key] = fun
        })
    }

    return model
}
