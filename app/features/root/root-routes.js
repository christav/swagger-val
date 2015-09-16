// Routes and logic for the root of the web application.

'use strict';
var debug = require('debug')('swagger-val:root');
var express = require('express');
var routeResult = require('../../lib/route-result');
var path = require('path');

var rootTemplate = path.join(__dirname, 'root');

var router = express.Router();

router.get('/', function (req, res, next) {
  debug('trying to render root template');
  req.result = routeResult.render(rootTemplate, { message: req.flash('message') });
  next();
}, routeResult.execute);;

router.get('/favicon.ico', function (req, res) {
  res.status(404).end();
});

module.exports = router;
