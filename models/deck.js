const db = require('.././config/database').getDb();
const mongo = require('mongodb');
const collection = db.collection('decks');

module.exports.findAllDecks = (callBack) => {
  collection.find({}).toArray((err, docs) => {
    return callBack(null, docs);
  })
}

module.exports.findAllDecksByUsername = (username, callBack) => {
  collection.find({username: username}).toArray( (err, docs)=>{
    if(docs){
      return callBack(null, docs);
    }else if(err){
      return callBack(err, null);
    }else{
      return callBack(null, docs);
    }
  })
}

module.exports.findDeckByTitleAndUsername = (username, title, callBack) => {
  collection.find({title: title, username: username}).toArray((err, docs)=>{
    if(err)
      return callBack(err, null);
    else
      return callBack(null, docs);
  });
}

module.exports.findDeckById = (id, callBack) => {
  const oId = new mongo.ObjectId(id);
  collection.find({_id : oId}).toArray((err, docs)=>{
    if(docs[0])
      return callBack(null, docs[0]);
    else
      return callBack(err, null);
  });
}

module.exports.findDeckByUsername = (username, title, callBack) => {
  collection.find({title: title, username: username}).toArray((err, docs)=>{
    if(err)
      return callBack(err, null);
    else
      return callBack(null, docs);
  });
}

module.exports.addDeck = (deck, callBack) => {
  deck.created = Date.now();
  collection.insertOne(deck, function(err, result) {
    if(result)
      return callBack(null, result);
    else
      return callBack(err, null);
  });
}
module.exports.updateDeck = (id, deck, callBack) => {
  if( typeof id === String){
    id = new mongo.ObjectId(id);
  } else if(typeof id === Number){
    id = new mongo.ObjectId(id.toString());
  }
  collection.updateOne({_id : id}, deck).then(function(result){
    return callBack(result);
  })
}

// if the user views an owned deck, that does not count as a view
module.exports.updateViews = (id, username, callBack) => {
  const oId = new mongo.ObjectId(id);
  collection.findOne({_id : oId}, function(err, doc){
    if(doc.username != username) {
      collection.updateOne({_id : oId}, { $inc : { views : 1}}).then(function(result){
        return callBack(result);
      })
    } else {
      return callBack({modified: false});
    }
  })
}

module.exports.updateFlashcards = (id, newFlashcards, callBack) => {
  if( typeof id === String){
    id = new mongo.ObjectId(id);
  } else if(typeof id === Number){
    id = new mongo.ObjectId(id.toString());
  }
  id = new mongo.ObjectId(id);
  collection.updateOne({_id : id}, {$set : {flashcards : newFlashcards, lastModified: Date.now()}}).then(function(result){
    return callBack(result);
  })
}

module.exports.deleteDeck = (id, callBack) => {
  collection.deleteOne({_id : new mongo.ObjectId(id)}, function(err, result){
    callBack(result);
  })
}

const sortTypes = {"date-desc" : {"created" : -1}, "date-asc" : {"created" : -1},
                   "title-asc" : {"title" : 1}, "title-desc" : {"title" : -1},
                    "view-desc" : {"views" : -1}, "view-asc" : {"views" : 1}};

module.exports.findDecksByKeywords = (keywords, callBack) => {
  keywords = keywords.trim();
  var splitKeywords = keywords.split(/[ ]+/);
  let result = [], uniqueIds = [];
  for(let i = 0; i < splitKeywords.length; i++){
    splitKeywords[i] = splitKeywords[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var nextKeyword = new RegExp(".*" + splitKeywords[i] + ".*", "i");
    collection.find({$or: [{title: {$regex : nextKeyword}},
                           {subject: {$regex : nextKeyword}},
                          {flashcards: { $elemMatch : {$or : [{answer: {$regex: nextKeyword}},{question: { $regex : nextKeyword}}]}}}]}).toArray((err, docs) => {
                              docs = docs.filter((element, index) => {
                                return !uniqueIds.includes(element._id.valueOf().toString());
                              });
                              result = result.concat(docs);
                              uniqueIds = uniqueIds.concat(docs.map((element) => {
                                return element._id.valueOf().toString();
                              }))

                              if(i == splitKeywords.length-1){
                                if(!err){
                                  if(result.length === 0){
                                    module.exports.findAllDecks((err, result)=>{
                                      callBack(null, {decks : result, noMatch : true});
                                    })
                                  }else{
                                    return callBack(null, {decks: result, noMatch : false});
                                  }
                                }else{
                                  return callBack(err, null);
                                }
                              }
                            }
    );
  }
}
