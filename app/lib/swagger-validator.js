'use strict';

var debug = require('debug')('swagger-val:swagger-validator');
var swaggerSchema = require('swagger-schema-official/schema.json');
var tv4 = require('tv4');
var formatter = require('./json-formatter');

tv4.addSchema(swaggerSchema);

function parseSwagger(jsonText) {
  var swagger;
  try {
    swagger = JSON.parse(jsonText);
    return [swagger, null];
  } catch (ex) {
    debug('parsing of swagger failed: ' + ex.message);
    return [ null, {
      isValid: false,
      errors: [
        {
          'dataPath': null,
          'message': 'Invalid json, parse failed, ' + ex.message
        }
      ],
      body: []
    }];
  }
}

function validate(jsonText) {
  var parseResult = parseSwagger(jsonText);
  if(parseResult[1] !== null) {
    return parseResult[1];
  }

  var swagger = parseResult[0];
  var formattedSwagger = formatter.format(swagger);

  var validationResult = tv4.validateMultiple(swagger, swaggerSchema);

  if(validationResult.valid) {
    debug('swagger is valid');
    return {
      isValid: true,
      errors: [],
      body: formattedSwagger
    };
  }

  debug('swagger is invalid');
  return {
    isValid: false,
    errors: validationResult.errors,
    body: formattedSwagger
  };
}

module.exports = validate;
