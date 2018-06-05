var router = require('express').Router();
const user = require('.././models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('.././config/databaseConfig');
const passport = require('passport');

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({user: req.user});
});

router.post('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  if(req.body.password) {
    user.findUserByUsername(req.body.username, (err, result) => {
      bcrypt.compare(req.body.currentPassword, result.password, (err, match)=>{
        if(match){
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              user.findUserByUsernameAndUpdatePassword(req.body.username, hash, (result) => {
                if(result){
                  return res.json({success: true, msg: "Successfully updated profile!"});
                } else {
                  return res.json({success: false, msg: "Failure to update profile!"});
                }
              })
            })
          })
        } else {
          return res.json({success: false, msg: "Current password entered did not match password associated with account."});
        }
      })
    })
  } else if(req.body.first_name || req.body.last_name){
    user.findUserByUsernameAndUpdateName(req.body.username, req.body.first_name, req.body.last_name, (result) => {
      if(result){
        return res.json({success: true, msg: "Successfully updated profile!"});
      } else {
        return res.json({success: false, msg: "Failure to update profile!"});
      }
    })
  }
});

router.post('/login', (req, res) => {
  user.findUserByUsername(req.body.username, function(err, result){
    if(result){
      bcrypt.compare(req.body.password, result.password, function(err, match){
        if(match){
          const token = jwt.sign(result, config.secret, {expiresIn: 1000000} );
          res.json({success: true,
                    msg: "login success",
                    token: 'JWT ' + token,
                    user: {
                      first_name: result.first_name,
                      last_name: result.last_name,
                      username: result.username,
                      email: result.email,
                      watchlist: result.watchlist ? result.watchlist : null
                    }});
        }else{
          res.json({success: false, msg: "login fails"});
        }
      })
    } else {
          res.json({success: false, msg: "login fails"});
    }
  })
});

router.post('/register', (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
        const newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          email: req.body.email,
          password: hash
        }
        user.addUser(newUser, (err, result, takenFields) => {
          if(err){
            return res.json({success: false, msg: "error in registering user"});
          }else{
            if( takenFields && (takenFields["username"] != undefined || takenFields["email"] != undefined)){
              let arr = [];
              if(takenFields["username"] != undefined){
                arr.push("Username")
              }
              if(takenFields["email"] != undefined){
                arr.push("Email")
              }
              let message = ((arr.length == 2) ? arr.join("and") : arr[0]) + " already taken. Please select a different " + ((arr.length == 2) ? arr.join("and") : arr[0]) + ".";
              return res.json({success: false, msg: message , takenFields: takenFields});
            }
             return res.json({success: true, msg: "Registration successful! Log in to access your account."});
          }
        })
    });
  });
});

router.post('/validatePassword', (req, res) => {
  user.findUserByUsername(req.body.username, function(err, result){
    if(result){
      bcrypt.compare(req.body.password, result.password, function(err, match){
        if(match){
          res.json({success: true, msg: "Password match"})
        }else{
          res.json({success: false, msg: "Current password does not match. Please try again."});
        }
      })
    }
  })
})

router.post('/watchlist', (req, res) => {
  user.getFromWatchList(req.body.username, (err, watchlist) => {
    if(watchlist){
      if(!watchlist.includes(req.body.deckId)){
        user.addToWatchList(req.body.username, req.body.deckId, (result) => {
          if(result.nModified == 1){
            res.json({success : true, msg: "Deck successfully added to watchlist."});
          } else {
            res.json({success: false, msg: "Err: Deck not added from watchlist"});
          }
        });
      }else{
          res.json({success : false, msg: "Deck is already included in watchlist."});
      }
    } else {
      user.addToWatchList(req.body.username, req.body.deckId, (result) => {
        if(result.nModified == 1){
          res.json({success : true, msg: "Deck successfully added to watchlist."});
        } else {
          res.json({success: false, msg: "Err: Deck not added from watchlist"});
        }
      });
    }
  });
});

router.get('/watchlist', passport.authenticate('jwt', {session: false}), (req, res) => {
  user.getFromWatchList(req.user.username, (err, watchlist) => {
    if(watchlist){
      res.json({success: true, msg: "Watchlist acquired.", watchlist: watchlist});
    } else {
      res.json({success: false, msg: "error retrieving watchlist."});
    }
  })
})

router.delete('/watchlist/:deckId', passport.authenticate('jwt', {session: false}), (req, res) => {
  user.removeFromWatchList(req.user.username, req.params.deckId, (result) => {
    if(result.nModified == 1){
      res.json({success: true, msg: "Deck removed from watchlist."});
    }else{
      res.json({success: false, msg: "Err: Deck not removed from watchlist"});
    }
  })
})

module.exports = router;
