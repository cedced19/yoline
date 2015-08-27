var express = require('express');
var router = express.Router();
var app = require('../app');

router.get('/', function(req, res) {
    req.app.models.lesson.find().exec(function(err, models) {
        if(err) return res.status(500).json({ err : err});
        res.json(models);
    });
});

router.post('/', function(req, res) {
    req.app.models.lesson.create(req.body, function(err, model) {
        if(err) return res.status(500).json({ err : err});
        res.json(model);
    });
});

router.get('/:id', function(req, res) {
    req.app.models.lesson.findOne({ id: req.params.id }, function(err, model) {
        if(err) return res.status(500).json({ err : err});
        if(model === '' || model === null || model === undefined) return res.status(404).json({ err: 404 });
        res.json(model);
    });
});

router.delete('/:id', function(req, res) {
    req.app.models.lesson.destroy({ id: req.params.id }, function(err) {
        if(err) return res.status(500).json({ err : err});
        res.json({ status: 'ok' });
    });
});

router.put('/:id', function(req, res) {
    delete req.body.id;
    req.app.models.lesson.update({ id: req.params.id }, req.body, function(err, model) {
        if(err) return res.json({ err: err }, 500);
        res.json(model);
    });
});

module.exports = router;
