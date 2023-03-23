// A bookshelf model that can be extended
const _ = require('lodash');

const bookshelf = require('./bookshelf');

module.exports = (modelName, tableName, props, staticProps) => {
    const model = bookshelf.model(modelName, {
        tableName,
        hasTimestamps: true,
        ...props,
    });

    if (typeof staticProps === 'object') {
        _(staticProps).each((fun, key) => {
            model[key] = fun;
        });
    }

    return model;
};
