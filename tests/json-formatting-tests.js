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
var joe = require('joe');
var chai = require('chai');
chai.use(require('chai-things'));
var expect = chai.expect;
var sfmt = require('sfmt');

var formatter = require('../app/lib/json-formatter');

joe.describe('Json display formatting', function (describe, it) {
  this.setNestedConfig({onError: 'ignore'});

  describe('empty object', function (describe, it) {
    var formatted;

    this.on('test.before', function () {
      formatted = formatter.format({});
    });

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

  describe('object with single level of properties', function (describe, it) {
    var formatted;

    this.on('test.before', function () {
      formatted = formatter.format({
        a: 1,
        b: 'hello',
        c: 'world'
      });
    });

    it('should have 5 lines', function () {
      expect(formatted).to.have.length(5);
    });

    it('should be level 0 for outer braces', function () {
      expect(formatted[0]).to.have.property('level', 0);
      expect(formatted[4]).to.have.property('level', 0);
    });

    it('should be level 1 for contents', function () {
      expect(_.slice(formatted, 1, formatted.length - 1)).all.to.have.property('level', 1);
    });
  });

  describe('object with properties and arrays', function (describe, it) {

    var formatted;

    this.on('test.before', function (test) {
      formatted = formatter.format({
        a: 1,
        b: {
          'c~': 'hello', d: 'world',
        },
        e: [
          'a', 'b',
          { name: 'prop1'},
          { name: 'prop2' },
          [
            { nested: [ 1, "two" ] },
            { 'why': 'not' }
          ]
        ]
      });
    });

    it('should have 28 lines', function () {
      expect(formatted).to.have.length(28);
    });

    it('should have expected levels', function () {
      expect(_.pluck(formatted, 'level')).to.deep.equal([
        0,
          1,
          1,
            2,
            2,
          1,
          1,
            2,
            2,
            2,
              3,
            2,
            2,
              3,
            2,
            2,
              3,
                4,
                  5,
                  5,
                4,
              3,
              3,
                4,
              3,
            2,
          1,
        0]);
    });

    it('should have commas between sibling nodes', function () {
      var trailingComma = /,$/;
      var siblingIndexes = [1, 3, 5, 7, 8, 11, 14, 18, 21];
      siblingIndexes.forEach(function (i) {
        expect(formatted[i].string).to.match(trailingComma, sfmt('Mismatch at index %d: %s', i, formatted[i].string));
      });
    });

    it('should not have commas where nodes are at different levels', function () {
      var trailingComma = /,$/;
      var differentNodes = [0, 2, 4, 6, 9, 10, 12, 13, 15, 16, 17, 19, 20, 22, 23, 24, 25, 26, 27];
      differentNodes.forEach(function (i) {
        expect(formatted[i].string).to.not.match(trailingComma, sfmt('Mismatch at index %d: %s', i, formatted[i].string));
      });
    });
  });

  describe('object with slashes in property names', function (describe, it) {
    var formatted;

    this.on('test.before', function () {
      formatted = formatter.format({
        a: {
          '/first': 'first',
          '/first/second': 'second'
        }
      });
    });

    it('should have escaped the slashes', function () {
      expect(formatted[3].path).to.match(/^\/a\/~1first~1second/);
    });
  });
});
