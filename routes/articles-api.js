var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET Articles */
router.get('/', function(req, res) {
    req.app.models.articles.find().exec(function(err, models) {
        if(err) return next(err);
        res.json(models);
    });
});

router.post('/', auth, function(req, res) {
    req.app.models.articles.create(req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

router.get('/:id', function(req, res) {
    req.app.models.articles.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        res.json(model);
    });
});

router.delete('/:id', auth, function(req, res) {
    req.app.models.articles.destroy({ id: req.params.id }, function(err) {
        if(err) return next(err);
        res.json({ status: 'ok' });
    });
});

router.put('/:id', auth, function(req, res) {
    delete req.body.id;
    req.app.models.articles.update({ id: req.params.id }, req.body, function(err, model) {
        if(err) return next(err);
        res.json(model[0]);
    });
});

module.exports = router;
