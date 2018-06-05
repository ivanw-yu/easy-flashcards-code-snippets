const db = require('.././config/database').getDb();
const mongo = require('mongodb');

module.exports.findUserById = (id, callBack) => {
  id = new mongo.ObjectId(id);
  db.collection('users').findOne(id, function(err, user){
    if(user)
      return callBack(null, user);
    else
      return callBack(err, null);
  })
}

module.exports.findUserByUsername = (username, callBack) => {
  db.collection('users').findOne({username: username}, function(err, user){
    if(!err)
      return callBack(null, user);
    else
      return callBack(err, null);
  });
}

module.exports.addUser = (user, callBack) => {
  db.collection('users').find({username: user.username}).toArray((err, docsUsername) => {
    db.collection('users').find({email: user.email}).toArray((err, docsEmail)=>{
      let takenFields = {};
      if(docsUsername.length > 0){
        takenFields["username"] = user.username;
      }
      if(docsEmail.length > 0){
        takenFields["email"] = user.email;
      }
      if(takenFields["email"] && takenFields["username"]){
        return callBack(null, null, takenFields);
      }else{
        db.collection('users').insertOne(user, function(err, insertedUser){
          if(err){
            return callBack(err, null, null);
          }else{
            return callBack(null, insertedUser, null);
          }
        });
      }
    });
  })
}


module.exports.findUserByIdAndUpdate = (id, user, callBack) => {
  if( typeof id === String){
    id = new mongo.ObjectId(id);
  } else if(typeof id === Number){
    id = new mongo.ObjectId(id.toString());
  }
  db.collection('users').updateOne({_id : id}, user).then(function(result){
    callBack(result);
  })
}

module.exports.findUserByUsernameAndUpdate = (username, user, callBack) => {
  db.collection('users').updateOne({username : username}, user).then(function(result){
    callBack(result);
  })
}

module.exports.findUserByUsernameAndUpdatePassword = (username, password, callBack) => {
  db.collection('users').updateOne({username : username}, {$set : {password: password}}).then(function(result){
    callBack(result);
  })
}

module.exports.findUserByUsernameAndUpdateName = (username, firstName, lastName, callBack) => {
  db.collection('users').updateOne({username: username}, { $set : {first_name : firstName, last_name : lastName}}).then((result) => {
    callBack(result);
  })
}

module.exports.deleteUserById = (id, user, callBack) => {
  if( typeof id === String){
    id = new mongo.ObjectId(id);
  } else if(typeof id === Number){
    id = new mongo.ObjectId(id.toString());
  }
  db.collection('users').deleteOne({_id : id}).then(function(result){
    callBack(result);
  });
}

module.exports.addToWatchList = (userName, deckId, callBack) => {
    db.collection('users').updateOne({username: userName}, {$push : {watchlist : deckId}}).then(function(result){
      callBack(result.result);
    })
}

module.exports.removeFromWatchList = (userName, deckId, callBack) => {
    db.collection('users').updateOne({username: userName}, {$pull : {watchlist : deckId}}).then(function(result){
      callBack(result.result);
    });
}

module.exports.getFromWatchList = (userName, callBack) => {
  db.collection('users').find({username: userName}).toArray( (err, docs) => {
    if(err){
      return callBack(err, null);
    }else{
      return callBack(null, docs[0].watchlist);
    }
  });
}
