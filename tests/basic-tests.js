'use strict';

var expect = require('chai').expect;
var joe = require('joe');
var tv4 = require('tv4');

var schema = require('swagger-schema-official/schema.json');
tv4.addSchema(schema);

joe.describe('Valid swagger', function (describe, it) {
  var swagger = require('./sample-swagger/basicValid.swagger.json');

  it('should be valid', function () {
    var result = tv4.validateResult(swagger, schema);
    expect(result.valid).to.be.true;
  });
});

joe.describe('Invalid swagger', function (describe, it) {
  var swagger = require('./sample-swagger/missingParameterTypes.swagger.json');

  it('should not be valid', function () {
    var result = tv4.validateMultiple(swagger, schema);
    expect(result.valid).to.be.false;
  });
});
