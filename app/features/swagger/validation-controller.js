'use strict';

var debug = require('debug')('swagger-val:swagger-validation-controller');
var _ = require('lodash');
var express = require('express');
var path = require('path');
var Promise = require('bluebird');
var promiseUtils = require('../../lib/promise-utils');
var routeResult = require('../../lib/route-result');
var sfmt = require('sfmt');
var util = require('util');

// Temporary debugging route

var debugView = path.join(__dirname, 'debug');

function dumpFormData(req, res) {
  return Promise.resolve().then(function () {
    var model = {
      formData: util.inspect(req.body, {depth: 6})
    };
    debug(model);
    req.result = routeResult.render(debugView, model);
  });
}

function figureOutPostType(req, res) {
  debug('processing post request');
  return Promise.resolve().then(function () {
    switch(req.body['input-flavor']) {
      case 'input':
        debug('its input');
        req.flash('message', 'you gave input');
        break;
      case 'url':
        debug('its url');
        req.flash('message', 'you gave a url');
        break;
      case 'file':
        debug('its file');
        req.flash('message', 'you gave a file');
        break;
      default:
        debug('its unknown');
        req.flash('message', 'I have no idea');
        break;
    }
    debug('setting result to redirect');
    req.result = routeResult.redirect('/');
  });
}

var router = express.Router();
router.usePromise(figureOutPostType);
//promiseUtils.usePromise(router, figureOutPostType);

module.exports.post = router;