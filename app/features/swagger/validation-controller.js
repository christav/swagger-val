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

var validator = require('../../lib/swagger-validator');
var ResultsViewModel = require('./results-viewmodel');

// Temporary debugging route

var debugView = path.join(__dirname, 'debug');
var resultsView = path.join(__dirname, 'results');

function dumpFormData(req, res) {
  return Promise.resolve().then(function () {
    var model = {
      formData: util.inspect(req.body, {depth: 6})
    };
    debug(model);
    req.result = routeResult.render(debugView, model);
  });
}

var inputHandlers = {
  input: {
    fieldName: 'swagger-input',
    validator: validateFromInput
  },
  url: {
    fieldName: 'swagger-url',
    validator: validateFromUrl
  },
  file: {
    fieldName: 'swagger-file',
    validator: validateFromFile
  }
};

function figureOutPostType(req, res) {
  debug('processing post request');
  debug(util.inspect(req.body, {depth: 3}));
  var handler = inputHandlers[req.body['input-flavor']];
  if (_.isUndefined(handler)) {
    req.result = routeResult.errorResult(400, 'Unknown input flavor');
    return Promise.resolve();
  }

  return handler.validator(req.body[handler.fieldName])
    .then(function (result) {
      debug(sfmt('Rendering view model %s', util.inspect(result, {depth: null})));
      req.result = routeResult.render(resultsView, result);
    });
}

function validateFromInput(input) {
  return Promise.resolve().then(function () {
    debug('Attempting to parse ' + input);
    var results = validator(input);
    var model = new ResultsViewModel(results);
    return model;
  });
}

function validateFromUrl(url) {
  return Promise.resolve(new ResultsViewModel({
    isValid: false,
    errors: [ {
      dataPath: null,
      message: 'Url support not implemented'
    }]
  }));
}

function validateFromFile(file) {
  return Promise.resolve(new ResultsViewModel({
    isValid: false,
    errors: [ {
      dataPath: null,
      message: 'File support not implemented yet'
    }]
  }));
}

var router = express.Router();
router.usePromise(figureOutPostType);

module.exports.post = router;