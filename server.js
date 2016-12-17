'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

routes(app);

// top line will allow the port to be set by heroku or default to 8080 for local
// testing of the API server
var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Node.js listening on port ' + port + '...');
})
