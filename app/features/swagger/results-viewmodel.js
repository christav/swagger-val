// Basic viewmodel class that reformats and
// rearranges the validation results for display

'use strict';

var _ = require('lodash');
var handlebars = require('handlebars');

var indentString = _.repeat('&nbsp;', 4);

module.exports = function ResultsViewModel(parseResults) {
  this.isValid = parseResults.isValid;
  this.globalErrors = parseResults.errors.filter(isGlobalError);
  this.hasGlobalErrors = this.globalErrors.length > 0;

  var errorsByPath = consolidateErrors(parseResults.errors.filter(_.negate(isGlobalError)));
  this.lines = (parseResults.body || []).map(function (line, index) {
    var lineHasErrors = !!(errorsByPath[line.path]);
    return {
      lineNum: index + 1,
      level: line.level,
      path: line.path,
      string: new handlebars.SafeString(_.repeat(indentString, line.level) + line.string),
      hasErrors: lineHasErrors,
      errorClass: lineHasErrors ? 'text-danger' : '',
      errors: indentedErrors(errorsByPath[line.path], line.level) || []
    };
  });
};

function consolidateErrors(parseErrors) {
  return parseErrors.reduce(function (results, err) {
    var errList = results[err.dataPath] || [];
    errList.push(err);
    results[err.dataPath] = errList;
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

function isGlobalError(err) { return err.dataPath === null; }