'use strict';
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;

var test = {hello: "world"};
console.log(test);

// routes for API endpoints
module.exports = function (app, db) {
  var jsonParser = bodyParser.json();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.route('/')
    .get(function(req,res) {
      res.sendFile(process.cwd() + '/public/index.html');
    });

  app.route('/api/posts/')
    .get(function(req,res) {
      // get a list from the db and return it
      findAllDocuments(db, function(docs) {
        //res.send([{test:"test"},{testTwo:"testTwo"},req.params.key, req.params.id]);
        res.send(docs);
        //db.close();
        });

    })
    .post(jsonParser, function(req,res) {
      if (!req.body) return res.sendStatus(400)
      // add a post to the db
      var newPost = JSON.parse(req.body.blogpost);
      //res.json(req.body.id);
      console.log(newPost);
      insertDocuments(db, newPost, function() {
        res.send("Blog post received");
        //db.close();
        });

    });

  app.route('/api/posts/:id')
    .get(function(req,res) {
      // return a single post from the db
      var docNumber = req.params.id;
      //res.json("Here is post #" + req.params.id);
      findADocument(db, docNumber, function(docs) {
        //res.send(docs);
        //console.log(docs);
        res.send(docs);
        //db.close();
      });
    });

 // Not yet working via postman; responds that it cannot delete?
  app.route('/api/posts/:id')
    .delete(function(req,res) {
      // delete a post from the db
      var docNumber = req.params.id;
      removeDocument(db, docNumber, function() {
        res.send("Document deleted");
        //db.close();
      });
      //res.send("Delete request to endpoint for post #" + req.params.id);
    });
}

var insertDocuments = function(db, newPost, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(newPost, function(err, result) {
    //assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    console.log("Inserted the new post");
    callback(result);
  });
}

var removeDocument = function(db, postNumber, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.deleteOne({ _id: ObjectID(postNumber) }, function(err, result) {
    //assert.equal(err, null);
    //assert.equal(1, result.result.n);
    console.log("Removed the document with the ID of " + postNumber);
    callback(result);
  });
}

// Find one doc (right now where key a has the property value of 3)
var findADocument = function(db, postNumber, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({ _id: ObjectID(postNumber) }, function(err, docs) {
    //assert.equal(err, null);
    var arraified = docs.toArray(function(err,docz){
      console.log(docz[0]);
      callback(docz[0]);
    })
    //console.log("Found the requested blog post without error");
    //console.log(docs);

  });
}

// Find a maximum of 40 of the docs as an array
var findAllDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).limit(40).toArray(function(err, docs) {
    //assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    //res.send(docs);
    callback(docs);
  });
}
