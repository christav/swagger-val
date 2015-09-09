/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

var _ = require('lodash');
var debug = require('debug')('json-formatter');
var sfmt = require('sfmt');

function formatObject(level, parentPath, propertyName, obj) {
  debug(sfmt('formatting object %i', obj));
  return _(obj)
    .pairs()
    .map(function (pair) {
      debug(sfmt('Formatting property %i', pair));
      var formatted = formatProperty(level, parentPath, pair[0], pair[1]);
      debug(sfmt('formatted = %i', formatted));
      return formatted;
    })
    .flatten()
    .value();
}

function formatProperty(level, parentPath, propertyName, propertyValue) {
  var propertyPath = [parentPath, createPathSegment(propertyName)].join('/');
  var formatted;
  var preamble;
  var postamble;

  function makePreamble(preambleChar) {
    return {
      string: sfmt('"%{0}": %{1}', propertyName, preambleChar),
      level: level,
      path: propertyPath
    };
  }

  function makePostamble(postambleChar) {
    return {
      string: sfmt('%{0}', postambleChar),
      level: level,
      path: propertyPath
    };
  }

  if (_.isObject(propertyValue)) {
    debug('value is object');
    preamble = makePreamble('{');
    formatted = formatObject(level + 1, propertyPath, propertyName, propertyValue);
    postamble = makePostamble('}');
  }
  else if (_.isArray(propertyValue)) {
    debug('value is array');
    preamble = makePreamble('[');
    formatted = formatArray(level + 1, propertyPath, propertyName, propertyValue);
    postamble = makePostamble(']');
  }
  else {
    debug('value is scalar');
    preamble = [];
    formatted = formatScalar(level, propertyPath, propertyName, propertyValue);
    postamble = [];
  }

  return _.flatten([preamble, formatted, postamble]);
}

function formatArray(level, parentPath, propertyName, arr) {
}

function formatScalar(level, parentPath, propertyName, propertyValue) {
  if (_.isString(propertyValue)) {
    propertyValue = sfmt('"%s"', propertyValue);
  }
  return [{
      string: sfmt('"%{0}": %{1}', propertyName, propertyValue),
      level: level,
      path: parentPath
    }];
}

function createPathSegment(propertyName) {

  return propertyName.replace('~', '~0').replace('/', '~1');
}

exports.format = function (data) {
  return _.flatten([
      { string: '{', level: 0, path: '/' },
      formatObject(1, '', null, data),
      { string: '}', level: 0 }
  ]);
};
