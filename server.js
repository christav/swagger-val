var debug = require('debug')('swagger-val');
var sfmt = require('sfmt');
var app = require('./app');

debug('Starting up');
app.start(function () {
  debug(sfmt('App started on %{0}', app.info.uri));
});
