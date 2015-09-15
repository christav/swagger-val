var debug = require('debug')('swagger-val');
var sfmt = require('sfmt');
var app = require('./app');

var port = +(process.env.PORT || 3000);

debug('Starting up on port ' + port);

app.set('port', port);

var server = app.listen(app.get('port'), function () {
  debug(sfmt('Express server listening on port %d', server.address().port));
});
