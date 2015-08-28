var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../policies/auth.js');

/* GET Dashboad */
router.get('/', auth, function(req, res, next) {
        res.render('dashboard', {});
});

router.get('/login', function(req, res, next) {
  res.render('dashboard-login', {});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureFlash: false, failureRedirect: '/dashboard/login' }));

module.exports = router;
