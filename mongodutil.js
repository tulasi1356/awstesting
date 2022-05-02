var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/projectManagement"; //connection string

var dbCon;

var ObjectId = require('mongodb').ObjectId;

module.exports = {

connectToServer : function(callback){

MongoClient.connect(url, function (err, db) {

if (err) throw err;

console.log("Database created!");

dbCon = db.db("projectManagement");

return callback( err );

});

},

getDb: function(){

return dbCon;

},

ObjectId : ObjectId

};