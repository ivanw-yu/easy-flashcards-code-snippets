var router = require('express').Router();
const deck = require('.././models/deck.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('.././config/databaseConfig');
const passport = require('passport');


router.get("/", (req, res) => {
  deck.findAllDecks(function(result){
    res.send(result);
  })
})

router.get("/search/:keywords*?", (req, res) => {
  if(req.params.keywords && req.params.keywords.length > 0){
    let decodedParams = decodeURIComponent(req.params.keywords);
    deck.findDecksByKeywords(decodedParams ? decodedParams : "", function(err, result){
      if(result){
        res.json({success: true,msg: "search success", decks : result.decks, keywords: req.params.keywords, noMatch: result.noMatch })
      }else{
        res.json({success: false, msg: "error searching"});
      }
    })
  } else {
    deck.findAllDecks( (err, result) => {
      res.json({success: true,msg: "search success", decks : result, keywords: req.params.keywords, noMatch: true })
    })
  }
})

router.get("/dashboard", passport.authenticate("jwt", {session: false}), (req, res) => {
  deck.findAllDecksByUsername(req.user.username, (err, decks) => {
    res.json({decks : decks});
  });
})

router.get("/view/:id", (req, res)=>{
    deck.findDeckById(req.params.id, (err, deckResult) => {
      if(deckResult){
        res.json({success: true, msg: "deck successfully retrieved", deck : deckResult});
      }else{
        res.json({success: false, msg: "no deck found", deck : null});
      }
    })
})

router.post("/view/:id", (req, res)=>{
  deck.updateViews(req.params.id, req.body.username, (result) => {
    res.json(result);
  })
})

router.post("/create", passport.authenticate("jwt", {session: false}), (req, res)=>{
  deck.addDeck(req.body, function(err, data){
    if(data){
      res.json({success: true, msg: "deck created!"});
    }else{
      res.json({success: false, msg: "deck not created"});
    }
  });
});

router.post('/edit/:id', passport.authenticate("jwt", {session: false}), (req,res)=>{
  deck.updateFlashcards(req.params.id, req.body.flashcards, (result)=>{
    res.json({success: true, msg : "deck successfully updated!"});
  })
});

router.delete('/delete/:id', passport.authenticate("jwt", {session: false}), (req, res) =>{
  deck.deleteDeck(req.params.id, (result) => {
    res.json({success: "true", msg : "Deck has been removed"});
  })
});

module.exports = router;
