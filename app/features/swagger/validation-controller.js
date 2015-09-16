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
      req.result = routeResult.render(resultsView, result);
    });
}

function isGlobalError(err) {
  return err.dataPath === null;
}

function validateFromInput(input) {
  return Promise.resolve().then(function () {
    debug('Attempting to parse ' + input);
    var results = validator(input);
    var globalErrors = results.errors.filter(isGlobalError);
    var validationErrors = results.errors.filter(_.negate(isGlobalError));

    var model = {
      isValid: results.isValid,
      globalErrors: globalErrors,
      hasGlobalErrors: globalErrors.length > 0,
      validationErrors: validationErrors,
      hasValidationErrors: validationErrors > 0,
      body: results.body
    };
    return model;
  });
}

function validateFromUrl(url) {
  return Promise.resolve({
    isValid: false,
    errors: [ {
      path: null,
      message: 'Url support not implemented'
    }]
  });
}

function validateFromFile(file) {
  return Promise.resolve({
    isValid: false,
    errors: [ {
      path: null,
      message: 'File support not implemented yet'
    }]
  });
}

var router = express.Router();
router.usePromise(figureOutPostType);

module.exports.post = router;