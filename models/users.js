var Waterline = require('Waterline');
var hash = require('password-hash');

var format = function(user, cb) {
    user.name = user.name.charAt(0).toUpperCase() + user.name.substring(1).toLowerCase();
    if (user.password) {
        user.password = hash.generate(user.password);
    }

    cb();
};

var Users = Waterline.Collection.extend({
    identity: 'users',
    connection: 'save',
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
        mail: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        twitter: {
            type: 'string',
            required: false
        },
        facebook: {
            type: 'string',
            required: false
        }
    },

    beforeCreate: format,
    beforeUpdate: format
});

module.exports = Users;
