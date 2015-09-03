'use strict';

var expect = require('chai').expect;
var joe = require('joe');
var tv4 = require('tv4');

var schema = require('swagger-schema-official/schema.json');

joe.describe('Valid swagger', function (describe, it) {
  var swagger = require('./sample-swagger/basicValid.swagger.json');

  it('should be valid', function () {
    var result = tv4.validateResult(swagger, schema);
    expect(result.valid).to.be.true;
  });
});
