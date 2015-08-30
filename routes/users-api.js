var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET Users */
router.get('/', function(req, res) {
    req.app.models.users.find().exec(function(err, models) {
        if(err) return res.status(500).json({ err : err });
        models.forEach(function(model){
            delete model.password;
        });
        res.json(models);
    });
});

router.post('/', auth, function(req, res) {
    req.app.models.users.create(req.body, function(err, model) {
        if(err) return res.status(500).json({ err : err });
        res.json(model);
    });
});

router.get('/:id', function(req, res) {
    req.app.models.users.findOne({ id: req.params.id }, function(err, model) {
        if(err) return res.status(500).json({ err : err });
        if(model === '' || model === null || model === undefined) return res.status(404).json({ err: 404 });
        delete model.password;
        res.json(model);
    });
});

router.delete('/:id', auth, function(req, res) {
    req.app.models.users.destroy({ id: req.params.id }, function(err) {
        if(err) return res.status(500).json({ err : err });
        res.json({ status: 'ok' });
    });
});

router.put('/:id', auth, function(req, res) {
    delete req.body.id;
    req.app.models.users.update({ id: req.params.id }, req.body, function(err, model) {
        if(err) return res.json({ err: err }, 500);
        res.json(model);
    });
});

module.exports = router;
