'use strict';

var debug = require('debug')('swagger-val:main');
var Hapi = require('hapi');
var handlebars = require('handlebars');
var layouts = require('handlebars-layouts');
var Hoek = require('hoek');

var sfmt = require('sfmt');

var routes = require('./routes');
var server = new Hapi.Server();

var engine = handlebars.create();
layouts.register(engine);

var port = +(process.env['PORT'] || 3000);
server.connection({port: port});
server.register([require('vision'), require('inert')], function (err) {
  Hoek.assert(!err, err);

  server.views({
    engines: {
      hbs: engine
    },
    relativeTo: __dirname,
    path: './views',
    partialsPath: './views/partials',
    helpersPath: './lib/viewHelpers',
  });

  routes.forEach(function (route) {
    debug(sfmt('Binding route for %{0}', route.path));
    server.route(route);
  });
});

module.exports = server;
