'use strict';

var Hapi = require('hapi');
var Hoek = require('hoek');

var server = new Hapi.Server();

server.reg

var port = +(process.env['PORT'] || 3000);
server.connection({port: port});
server.register(require('vision'), function (err) {
  Hoek.assert(!err, err);

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layouts',
    partialsPath: './views/partials',
    helpersPath: './lib/viewHelpers'
  })
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, it\'s working!');
  }
});

module.exports = server;
