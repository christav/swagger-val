'use strict';

// Patch router with usePromise and usePromiseIf methods

require('./lib/promise-utils');

var root = require('./features/root/root-routes');
var swagger = require('./features/swagger/swagger-routes');

module.exports = {
  '/': root,
  '/swagger': swagger
};
