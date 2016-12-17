'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var bodyParser = require('body-parser');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

var app = express();

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server at " + url);

  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

  routes(app, db);

  // top line will allow the port to be set by heroku or default to 8080 for local
  // testing of the API server
  var port = process.env.PORT || 8080;
  app.listen(port, function () {
    console.log('Node.js listening on port ' + port + '...');
  })

  //db.close();

});
