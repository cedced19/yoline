var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET Users */
router.get('/', function(req, res) {
    req.app.models.users.find().exec(function(err, models) {
        if(err) return next(err);
        models.forEach(function(model){
            delete model.password;
        });
        res.json(models);
    });
});

/* POST Users: create an user */
router.post('/', auth, function(req, res) {
    req.app.models.users.create(req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

/* GET User */
router.get('/:id', function(req, res) {
    req.app.models.users.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        delete model.password;
        res.json(model);
    });
});

/* DELETE User */
router.delete('/:id', auth, function(req, res) {
    req.app.models.users.destroy({ id: req.params.id }, function(err) {
        if(err) return next(err);
        res.json({ status: 'ok' });
    });
});

/* PUT User */
router.put('/:id', auth, function(req, res) {
    delete req.body.id;
    req.app.models.users.update({ id: req.params.id }, req.body, function(err, model) {
        if(err) return next(err);
        res.json(model[0]);
    });
});

module.exports = router;
