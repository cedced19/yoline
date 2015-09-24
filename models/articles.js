var Waterline = require('Waterline');

var Articles = Waterline.Collection.extend({
    identity: 'articles',
    connection: 'save',

    attributes: {
        content: {
            type: 'string',
            required: true
        },
        title: {
            type: 'string',
            required: true
        },
        keywords: {
            type: 'array',
            required: true
        }
    }
});

module.exports = Articles;
