var Waterline = require('Waterline');
var hash = require('password-hash');

var Users = Waterline.Collection.extend({
    identity: 'users',
    connection: 'save',
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
        email: 'string',
        password: 'string',
        name: 'string'
    },

    beforeCreate: function(user, cb) {
        user.name = user.name.charAt(0).toUpperCase() + user.name.substring(1).toLowerCase();
        user.password = hash.generate(user.password);
        cb();
    }
});

module.exports = Users;
