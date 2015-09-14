'use strict';

var debug = require('debug')('swagger-val:main');
var Hapi = require('hapi');
var Hoek = require('hoek');

var sfmt = require('sfmt');

var routes = require('./routes');
var server = new Hapi.Server();

server.reg

var port = +(process.env['PORT'] || 3000);
server.connection({port: port});
server.register([require('vision'), require('inert')], function (err) {
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
  });


  routes.forEach(function (route) {
    debug(sfmt('Binding route for %{0}', route.path));
    server.route(route);
  });
});

module.exports = server;
