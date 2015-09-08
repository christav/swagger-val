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

var joe = require('joe');
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var sfmt = require('sfmt');

var formatter = require('../app/lib/json-formatter');

joe.describe('Json display formatting', function (describe, it) {
  this.setNestedConfig({onError: 'ignore'});

  describe('empty object', function (describe, it) {
    var formatted = formatter.format({});

    it('should have two lines', function () {
      expect(formatted).to.have.length(2);
    });

    it('should have open and close braces on each line', function () {
      expect(formatted[0].string).to.equal('{');
      expect(formatted[1].string).to.equal('}');
    });

    it('should have all lines at level 0', function () {
      expect(formatted).all.have.property('level', 0);
    });

    it('should have root path at first line', function () {
      expect(formatted[0]).to.have.property('path', '/');
    });
  });
});
