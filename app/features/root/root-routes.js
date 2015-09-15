// Routes and logic for the root of the web application.

'use strict';
var debug = require('debug')('swagger-val:root');
var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
  debug('trying to render root template');
  res.render('index');
});

router.get('/favicon.ico', function (req, res) {
  res.status(404).end();
});

module.exports = router;
