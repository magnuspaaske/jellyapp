// A bookshelf collection to be extended

const bookshelf = require('./bookshelf')

module.exports = (collectionName, collectionModel, props) => {
    return bookshelf.collection(collectionName, {
        model:          collectionModel,
        ...props
    })
}
