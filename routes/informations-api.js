var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var fs = require('fs');

var edit = function (name, req, cb) {
    req.app.locals[name] = req.body[name];
    fs.readFile('./config.json', function (err, data) {
      if (err) return cb(err);
      data = JSON.parse(data);
      data[name] = req.body[name];
      fs.writeFile('./config.json', JSON.stringify(data), function (err) {
        if (err) return cb(err);
        cb();
      });
    });
};

/* GET Informations */
router.get('/', function (req, res) {
    res.json({
      title: req.app.locals.title,
      description: req.app.locals.description,
      keywords: req.app.locals.keywords
    });
});

/* GET Title */
router.get('/title', function (req, res) {
    res.json({title: req.app.locals.title});
});

/* POST Title */
router.post('/title', auth, function (req, res, next) {
    edit('title', req, function (err) {
        if (err) return next(err);
        res.json({title: req.app.locals.title});
    });
});

/* GET Description */
router.get('/description', function (req, res) {
    res.json({description: req.app.locals.description});
});

/* POST Description */
router.post('/description', auth, function (req, res, next) {
    edit('description', req, function (err) {
        if (err) return next(err);
        res.json({description: req.app.locals.description});
    });
});

/* GET Keywords */
router.get('/keywords', function (req, res) {
    res.json({keywords:  req.app.locals.keywords});
});

/* POST Keywords */
router.post('/keywords', auth, function (req, res, next) {
    edit('keywords', req, function (err) {
        if (err) return next(err);
        res.json({keywords: req.app.locals.keywords});
    });
});

module.exports = router;
