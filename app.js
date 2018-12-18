//npm install --save express
//npm install --save pug
//npm install --save body-parser
//bower  make .bowerrc
//express validator
//express messages
//npm install --save messages
//                   express-session
//                   connect-flash
//                   express-validator
//npm install --save passport-local bcryptjs

const express = require('express');
//included in core modules
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash=require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator');
const config = require('./config/database');
const passport = require('passport');

//                                          DATABSE                     //
//Connecting database
//mongoose.connect('mongodb://localhost/nodekb');
mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to mongodb');
})

//Check for db errors
db.on('error', function(err){
  console.log(err);
});

//                                           DATABSE END                //

//                                           WHAT ARE MODELS?           //
//Bring in models
let Article = require('./models/article');
let User = require('./models/user');

//                                      VIEW ENGINES ARE BASICALLY TEMPLATES BUT LOOK IT UP ///
//Load View Engine
app.set('views',path.join(__dirname, 'views'))
app.set('view engine', 'pug');

//                                      BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false}))
//parse application json
app.use(bodyParser.json());

//Set Public Folder                        FIND OUT ABOUT PATH.JOIN
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware                  GO TO GITHUB PAGE FOR THIS
//https://github.com/expressjs/session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,

}));

//Express Validator Middleware
app.use(expressValidator());


//Express messages MIDDLEWARE
app.use(require('connect-flash')());              //messages require flash
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Congfig
require('./config/passport')(passport);
//Passport MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get('/', (req, res)=>{     //request and response

  Article.find({}, function(err, articles) {
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {
        title: 'Articles',  //title is a variable that is used in index.pug
        articles: articles
      });
    }
  });
});

//Route files
let articles = require('./routes/articles');
app.use('/articles', articles);

let users = require('./routes/users');
app.use('/users', users);

//Start Server
app.listen(3000, function(){
  console.log('Server up and running on port 3000');
});
