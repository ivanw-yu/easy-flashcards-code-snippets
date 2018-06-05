var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require(".././config/databaseConfig.js");
var mongo = require('mongodb');
var db = require('./database.js').getDb();
var user = require('.././models/user.js');

module.exports = (passport) => {
  let options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey : config.secret
  }

  passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    let id = new mongo.ObjectId(jwt_payload._id);
    user.findUserById(id, function(err, user){
      if(user)
        done(null, user);
      else
        done(err, null);
    })
  }))
};
