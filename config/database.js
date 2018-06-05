const MongoClient = require('mongodb').MongoClient;
const databaseUri = require("./databaseConfig").database;
let database;
module.exports = {
  setDb : (callBack) => {
    MongoClient.connect(databaseUri, (err, db) => {
      if(err)
        console.log(err)
      database = db;
      callBack(err);
    });
  },
  getDb : () => { return database; }
}
