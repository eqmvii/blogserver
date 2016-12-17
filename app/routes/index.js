'use strict';

var test = {hello: "world"};
console.log(test);

module.exports = function (app) {
  app.route('/')
    .get(function(req,res) {
      res.json("hello");
    });

  app.route('/api/posts')
    .get(function(req,res) {
      res.json(test);
    })
    .post(function(req,res) {
      res.json("new post");
    });

  app.route('/api/posts/:id')
    .get(function(req,res) {
      res.json("Here is post #" + req.params.id);
    });

 // Not yet working via postman; responds that it cannot delete?
  app.route('/api/posts/:id')
    .delete(function(req,res) {
      res.send("Delete request to endpoint for post #" + req.params.id);
    });
}
