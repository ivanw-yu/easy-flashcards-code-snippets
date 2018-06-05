const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;


app.listen(port, ()=>{
  console.log("Server is listenning at port " + port);
});


const database = require('./config/database.js');

// database can be accessed within this function
database.setDb(function(err){
  var db = database.getDb();
  app.use(passport.initialize());
  app.use(passport.session());
  require('./config/passport')(passport);

  var user = require('./routes/user');
  app.use('/user', user);

  var deck = require('./routes/deck');
  app.use('/deck', deck);

  app.get('/', (req, res) => {
    res.send('invalid');
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
});
