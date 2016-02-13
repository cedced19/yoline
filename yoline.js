#!/usr/bin/env node

var views = require('co-views'),
    koa = require('koa'),
    path = require('path'),
    fs = require('fs'),
    logger = require('koa-logger'),
    helmet = require('koa-helmet'),
    gzip = require('koa-gzip'),
    serve = require('koa-static'),
    route = require('koa-route'),
    meta = require('./config/meta'),
    ls = require('./lib/ls');

var contentPath = path.join(__dirname, '/content'),
    viewsPath = path.join(__dirname, '/templates');

var render = views(viewsPath, { ext: 'swig' });

var app = module.exports = koa();

var posts = ls(contentPath, meta.french, fs.readdirSync(contentPath));

if (app.env == 'development') {
  app.use(logger());
}

app.use(helmet());
app.use(gzip());

app.use(route.get('/', function *(){
  this.body = yield render('index', { meta: meta, posts: posts });
}));

app.use(route.get('/post/:id', function *(id){
  var post = posts.filter((item) => {
    return id == item.url;
  })[0];
  this.body = yield render('post', { meta: meta, post: post });
}));

app.use(serve('public'));
app.use(serve('media'));

app.listen(process.env.PORT || 3000);

fs.watch(contentPath, () => {
  fs.readdir(contentPath, (err, files) => {
    if (err) throw err;
    posts = ls(contentPath, meta.french, files);
  });
});
