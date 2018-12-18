const express = require('express');
const router = express.Router();

//Bring in models
let Article = require('../models/article');
let User = require('../models/user');
//Add Articles
router.get('/add', ensureAuthenticated, (req, res)=>{
  res.render('add_article', {
    title: 'Articles'
  });
});

//Edit articles
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id)
    {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }else {
      res.render('edit_article', {
        article:article
      });
    }

  });
});


//                                    POST REQUEST FOR ADDING ARTICLES
//Add submit POST request
router.post('/add', ensureAuthenticated, (req, res)=>{
  let article = new Article();
// BODY PARSER IS REQUIRED OTHERWISE IT WILL GIVE ERROR(CANNOT READ BODY.TITLE: UNDEFINED)

  req.checkBody('title', 'Title is required').notEmpty();
  //req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  //get errors
  let errors = req.validationErrors();
  if(errors)
  {
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  }
  else {
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return ;
      }
      else {
        req.flash('success', 'Article Added');
        res.redirect('/');            //redirecting to home page
      }
    });
  }
});

//Update Submit (EDIT)
router.post('/edit/:id', ensureAuthenticated, (req, res)=>{       //id is a placeholder
  let article ={};
  article.title = req.body.title;
  //article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return ;
    }
    else {
      req.flash('success', 'Article Edited');
      res.redirect('/');            //redirecting to home page
    }
  });

});

//                                           DELETE REQUEST
router.delete('/:id', ensureAuthenticated, (req, res)=>{
  if(!req.user._id){
    res.status(500).send();
  }else{
    let query ={_id:req.params.id}
    Article.findById(req.params.id, function(err, article) {
      if(article.author != req.user._id)
      {
        res.status(500).send();
      }else {
        Article.remove(query, function(err){
            req.flash('danger', 'Article Deleted');
            res.send('Success');     //200
        });
      }
    });
  }
});


//Get Single Article
router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, function(err, article){
    if(err)
    {
      req.flash('danger', 'Article might be broken');
      res.render('/');
    }
    else {
      User.findById(article.author, function(err, user){
        res.render('article', {
          article:article,
          user:req.user,
          author: user.name
        });
      });
    }

  });
});

//Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else {
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;  //WHAT IS THIS?
