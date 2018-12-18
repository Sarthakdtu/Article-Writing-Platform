const mongoose = require('mongoose');

//user schema
const UserSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});


let User = module.exports = mongoose.model('user', UserSchema); //name of the model and schema
