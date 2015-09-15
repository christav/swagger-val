'use strict';

var bodyParser = require('body-parser');
var debug = require('debug')('swagger-val:main');
var favicon = require('serve-favicon');
var express = require('express');
var formidable = require('express-formidable');
var flash = require('connect-flash');
var hbs = require('express-hbs');
var logger = require('morgan');
var path = require('path');
var sfmt = require('sfmt');

var routes = require('./routes');
var viewHelpers = require('./lib/viewHelpers');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, 'views', 'partials'),
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default.hbs'),
  layoutsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('view engine', 'hbs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, '..', 'bower_components/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, '..', 'bower_components/jquery/dist')));



//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(formidable.parse());
app.use(flash());

Object.keys(viewHelpers.sync).forEach(function (helper) {
  debug('registering sync helper ' + helper.name);
  hbs.registerHelper(helper, viewHelpers.sync[helper]);
});

Object.keys(viewHelpers.async).forEach(function (helper) {
  debug('register async helper ' + helper.name);
  hbs.registerAsyncHelper(helper, viewHelpers.async[helper]);
});

Object.keys(routes).forEach(function (route) {
  debug(sfmt('Binding route %s', route));
  app.use(route, routes[route]);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

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
