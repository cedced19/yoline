var Waterline = require('Waterline');

var Articles = Waterline.Collection.extend({
    identity: 'articles',
    connection: 'save',

    attributes: {
        content: 'string',
        title: 'string',
        keywords: 'array'
    }
});

module.exports = Articles;
