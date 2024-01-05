
// middleware to connect mongodb
const mongoose = require('mongoose');

//Passport-Local-Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
//This module auto-generates salt and hash fields, you don't require to hash the password with this crypto module
const passportLocalMongoose = require('passport-local-mongoose');

// connect to database --Data base name is 'userDB'
//connection from mongodb
//connection function is mangoose object
//userDB is not created yet
/// if schema is already created add name 
mongoose.connect('mongodb+srv://mebashimelis:myprovider27!@cluster0.sk2gd.mongodb.net/userDB?retryWrites=true&w=majority'); 

// Create Model
//define schema (table)
const Schema = mongoose.Schema;


//use schema object to crate new schema object
//No password
const User = new Schema({
  fname: String,
  lname: String,
  email: String,
  zipcode: String,
  username: String
});

//Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
User.plugin(passportLocalMongoose);

//export the model
module.exports = mongoose.model('userinfos', User);

////////////
//testing
//This is used to insert testing data
//user is schema object  userinfos is the name of collection
// create collection (userinfos) using schema object using user
/*var UserDetail = mongoose.model('userinfos', User);*/

// mongoose model calls register to insert model
/*UserDetail.register({name: 'test', email: 'test@test.com',  username: 'test' }, 'password');*/

