'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server();

var port = +(process.env['PORT'] || 3000);
server.connection({port: port});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, it\'s working!');
  }
});

module.exports = server;
