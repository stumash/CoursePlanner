/*

might as well ignore this file.

for what it's worth it lets you view documents from the db and/or delete them.

-David

 */

// var insertDocuments = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     { _id : "Heym", a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }

var collectionName = "courseSequences";

var deleteAllDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection(collectionName);
  // Find some documents
  collection.deleteMany({}, function(err, result) {
    assert.equal(err, null);
    console.log("Deleted all records");
    callback(result);
  });

}

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection(collectionName);
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://138.197.6.26:27017/mongotest';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  //
  // deleteAllDocuments(db, function(){
  //   db.close();
  // });

    findDocuments(db, function() {
        db.close();
    });
});
