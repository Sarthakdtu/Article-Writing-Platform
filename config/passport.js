const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
//const passport = require('passport');
module.exports = function(passport) {
  //LocalStrategy
  passport.use(new LocalStrategy(function(username, password, done){
    let query = {username:username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
      }
      //match password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }
        else {
          return done(null, false, {message:'Wrong credentials'});
        }
      });
    });
  }));
    passport.serializeUser(function(user, done) {    //passport docs
      done(null, user.id);
  });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
}
