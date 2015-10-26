var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var passport = require('passport');
var hash = require('password-hash');
var flash = require('connect-flash');
var compress = require('compression');
var helmet = require('helmet');
var session = require('express-session');

var config = require('./config.json');

var FileStore = require('session-file-store')(session);
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var dashboard = require('./routes/dashboard');
var articles = require('./routes/articles-api');
var users = require('./routes/users-api');
var version = require('./routes/version-api');
var informations = require('./routes/informations-api');
var go = require('./routes/go');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compress());

// development css and js management
// will not minify
if (app.get('env') === 'development') {
  app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
  }));
  app.use('/javascripts/dashboard.js', browserify(__dirname + '/public/javascripts/dashboard/index.js', {
    debug: true,
    minify: false
  }));
}

// production css and js management
// will minify
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  outputStyle: 'compressed',
  sourceMap: false
}));
app.use('/javascripts/dashboard.js', browserify(__dirname + '/public/javascripts/dashboard/index.js', {
  debug: false,
  minify: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(flash());
app.use(session({
    secret: 'yoline loves rock',
    name: 'yoline-session',
    proxy: false,
    resave: true,
    saveUninitialized: true,
    store:  new FileStore({ path: './tmp/sessions', logFn: function () {} })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/api/articles', articles);
app.use('/api/users', users);
app.use('/api/version', version);
app.use('/api/informations', informations);
app.use('/go', go);

// load informations
app.locals.title = config.title;
app.locals.description = config.description;
app.locals.keywords = config.keywords;

// authentication
passport.serializeUser(function(model, done) {
      done(null, model.id);
});

passport.deserializeUser(function(id, done) {
      app.models.users.findOne({ id: id } , function (err, model) {
          delete model.password;
          done(err, model);
      });
});

// define local strategy
passport.use('local', new LocalStrategy({
      usernameField: 'mail',
      passwordField: 'password'
},
function(mail, password, done) {
        // search in database
        app.models.users.findOne({ mail: mail }, function (err, model) {
          if (err) { return done(err); }
          if (!model) {
            return done(null, false, { message: 'Incorrect email.' });
          }

          // test password
          if(hash.verify(password, model.password)) {
            var returnmodel = {
                mail: model.mail,
                id: model.id
              };
              return done(null, returnmodel, {
                message: 'Logged in successfully.'
              });
          } else {
            return done(null, false, {
                message: 'Invalid password.'
            });
          }
        });
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
