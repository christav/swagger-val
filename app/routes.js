'use strict';
var path = require('path');

module.exports = [
  // Static files
  {
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '../webroot')
      }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'index'
    }
  }
];
