var Waterline = require('Waterline');

var Articles = Waterline.Collection.extend({
    identity: 'articles',
    connection: 'save',

    attributes: {
        content: {
            type: 'string',
            required: true
        },
        uri: {
            type: 'string',
            required: true,
            unique: true
        },
        title: {
            type: 'string',
            required: true
        },
        keywords: {
            type: 'array',
            required: true
        }
    },

    beforeValidate: function (article, cb) {
        if (!article.uri) {
            article.uri = article.id + '-' + article.title.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
        }
        cb();
    }
});

module.exports = Articles;
