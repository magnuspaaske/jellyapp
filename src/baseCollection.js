// A bookshelf collection to be extended

const bookshelf = require('./bookshelf');

module.exports = (collectionName, collectionModel, props) => {
    const collection = bookshelf.collection(collectionName, {
        model: collectionModel,
        ...props,
    });

    return collection;
};
