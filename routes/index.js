var express = require('express');
var slug = require('slug');
var router = express.Router();

/* GET Home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yoline' });
});

router.get('/:id-:title', function(req, res, next) {
  req.app.models.articles.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        if(slug(model.title, {lower: true}) != req.params.title) return next(err);
        res.render('articles', model);
    });
});

module.exports = router;
