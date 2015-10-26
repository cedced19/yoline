var express = require('express');
var slug = require('slug');
var router = express.Router();

/* GET Article: redirect to the complete uri */
router.get('/:id', function(req, res, next) {
  req.app.models.articles.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        res.redirect(308, '/' + model.id + '-' + slug(model.title, {lower: true}));
    });
});

module.exports = router;
