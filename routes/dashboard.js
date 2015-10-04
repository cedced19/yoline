var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../policies/auth.js');

/* GET Dashboard */
router.get('/', auth, function(req, res, next) {
    res.cookie('yoline-user', JSON.stringify(req.user));
    res.render('dashboard', {});
});

router.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard/');
    } else {
        req.app.models.users.find().exec(function (err, model) {
          if(err) return res.status(500).json({ err : err });
          res.render('dashboard-login', { signup: (model.length === 0), error: req.flash('error')[0] });
        });
    }
});

router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard/', failureFlash: true, failureRedirect: '/dashboard/login' }));

router.post('/signup', function(req, res, next) {
    req.app.models.users.find().exec(function (err, model) {
        if(err) return res.status(500).json({ err : err });
        if (model.length === 0) {
            req.app.models.users.create(req.body, function(err, model) {
                if(err) return res.status(500).json({ err : err });
                res.redirect('/dashboard/login');
            });
        } else {
            res.redirect('/dashboard/login');
        }
      });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/dashboard/login');
});

module.exports = router;
