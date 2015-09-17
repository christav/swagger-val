// Basic viewmodel class that reformats and
// rearranges the validation results for display

'use strict';

var debug = require('debug')('swagger-val:results-viewmodel');
var _ = require('lodash');
var handlebars = require('handlebars');
var sfmt = require('sfmt');

var indentString = _.repeat('&nbsp;', 4);

module.exports = function ResultsViewModel(parseResults) {
  this.isValid = parseResults.isValid;
  this.globalErrors = parseResults.errors.filter(isGlobalError);
  this.hasGlobalErrors = this.globalErrors.length > 0;

  var errorsByPath = consolidateErrors(parseResults.errors.filter(_.negate(isGlobalError)));
  debug(sfmt('Errors from validator by path: %i', errorsByPath));
  this.lines = (parseResults.body || []).map(function (line, index) {
    var lineHasErrors = !!(errorsByPath[line.path]);
    return {
      lineNum: index + 1,
      level: line.level,
      path: line.path,
      string: new handlebars.SafeString(_.repeat(indentString, line.level) + line.string),
      hasErrors: lineHasErrors,
      errorClass: lineHasErrors ? 'error-line' : '',
      errors: indentedErrors(errorsByPath[line.path], line.level) || []
    };
  });
};

function consolidateErrors(parseErrors) {
  return parseErrors.reduce(function (results, err) {
    var errList = results[err.dataPath] || [];
    errList.push(flattenErrors(err));
    results[err.dataPath] = _.flatten(errList);
    return results;
  }, {});
}

function indentedErrors(errors, level) {
  if (!errors) { return errors; }
  return errors.map(function (err) {
    return _.assign({}, err, {
      message: new handlebars.SafeString(_.repeat(indentString, level) + err.message) });
  });
}

function flattenErrors(err) {
    function flattenError(error, level, results) {
      results.push({ message: _.repeat(indentString, level) + error.message });
      if (error.subErrors && error.subErrors.length && error.subErrors.length > 0) {
        for(var i = 0; i < error.subErrors.length; ++i) {
          results = flattenError(error.subErrors[i], level + 1, results);
        }
      }
      return results;
    }

    var results = [];
    results = flattenError(err, 0, results);
    debug(sfmt('flattened errors = %i', results));
    return results;
}

function isGlobalError(err) { return err.dataPath === null; }
