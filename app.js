//import the module (library)--express
const express = require('express');
//This app is an express.js Object
const app = express();
// define port 3000 
const port = 3000;



//Use express static to serve static files 
//such as images, CSS files, and JavaScript files
//You can use the express.static middleware to access files from this folder 
//This line is necessary for serve images
app.use(express.static(__dirname));


//route definition
//a callback function that will be invoked whenever there is an HTTP GET request 
//with a path ('/') relative to the site root.
// you can definde differnt url pattern to request different site
// is default
//route to the bookstore.html
//app.get('/', (req, res)=>{
 // res.sendFile(__dirname + '/bookstore.html');
//})

//route to bookstoere.css
app.get('/css', (req, res)=>{
  res.sendFile(__dirname + '/bookstore.css');
})
//route to bookstore.js
app.get('/js', (req, res)=>{
  res.sendFile(__dirname + '/bookstore.js');
})
//add route to products.json
app.get('/json', (req, res)=>{
  res.sendFile(__dirname + '/products.json');
})


/////////////////////////////////////////////////////////////////////
//////template

//1. set the html file to ejs

//2.
// for the server we have to set the view engine to handle the ejs 
app.set("view engine", "ejs");


//3.
//must create a views directory, and set it to be the root
//app.set("views", path.join(__dirname));
app.set("views", './');


/// you cant use sendfile for ejs becsaue ejs is not static
// need to use render function for ejs 

// app.get("/", (req, res) => {
//   res.render('bookstoreEJS', {
//     //name: "World",
//    // amount: 199
//   });
// });




////////////////////////////////////////////////////////////////
///////////////////////cookiesession



//cookie-session module allows us to create a cookie-session 
//var cookieSession = require('cookie-session')


//use cookieSession will create a property 'session' to the request (req)
// when we you use object (app - express object) is  cookie session 
// it will create a property called session to the request (req )

// app.use(cookieSession({
//   fname: 'test',
//   keys: ['key1', 'key2']
// }))


///////////////////////////////////////////
//////// user authentication

const User = require('./model.js')

//authentication middlware (post, get, use)
const passport = require('passport') 



//express-session is more abstract, it supports different session 
// sensetive information (userid and password) is stored in server side not front end 
//cookie-session is a simple, lightweight cookie-based saves everything 
const session = require('express-session');

// you can only see if youre loged in 
// have to log in
const connectEnsureLogin = require('connect-ensure-login');

//initialize passport for app so we can call passport.authenticate()
app.use(passport.initialize());


// use session to navigate from page to page (checkou page, main bookstore page, login page)

// 1. requre express session  session is using the entire app
// 2. use session as application midleware

app.use(session({
  secret: 'sljgoijwh;eojwp298u40t',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60*60*1000} //the cookie will expire after 1 hour. if expire you have to log back in  
}))

// combine the session with passport to garantee only users with valid session id can access the applicaion file
app.use(passport.session());


// create a local strategy susing uesr then we use the local strategy in the passport

passport.use(User.createStrategy());

//use static serialize and deserialize of model for passport session support
// when we serialize a passport it takes the userid  and stores in a cookie and it has one hour
// when you are using deserilize the user information is gone but the id is still there so we use the id with ddserilize user to find the information again in the database ( the passport contains it now)

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// url encoded is used to get information from a form in the html.
// it used to get data send by the html form
//This will add a property 'body' to request which contains the URL encoded bodies request.body
app.use(express.urlencoded({extended: true}));

//Use express static for multiple images
app.use(express.static(__dirname + '/image'));



app.get("/private", connectEnsureLogin.ensureLoggedIn(),(req, res) => {
  //create a variable counter in session
  req.session.counter = (req.session.counter || 0) + 1;
  res.render('bookstoreEJS', {
    amount:req.session.counter,
    fname: req.user.fname,
    lname: req.user.lname,
    username: req.user.username,
    email: req.user.email,
    zipcode: req.user.zipcome
  });
});

// app.get("/", (req, res) => {
//   //create a variable counter in session
//   req.session.fname = (req.session.fname);
//   res.render('bookstoreEJS', {
//     fname: req.session.fname
//   });
// });






//Route to private page
//the user is added into the passport
// then the passport is added into the app 
// so we can access the user property from the request 
// user property contains (fname email, username)
//when authentication succeeds, the req.user property is set 
//to the authenticated user, a login session is established
// app.get('/private', connectEnsureLogin.ensureLoggedIn(),  (req, res)=>{
//   res.render('bookstoreEJS',{
//     fname: req.user.fname
//   });
// })


// Route to Login Page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

//Route to Register
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// it is not a page. it is a request for a logout 
// the request object will call logout function 
// and the session will be destroy 
// send/redirect the user somewhere else (login page)
app.get('/logout', (req, res) =>{
  //console.log(req.session.id)
  //req.logout();
  req.session.destroy((err)=>{
    //cannot use req.session
    console.log(err)
  });
  res.redirect('/');
})

// define post request root handle form send by register page 
// form will be send through request called register-server
// the form action value in register.html and first parameter has go be the same (register-server)
// when submit the register form, it will come here, then we can access the form by  req.body.variable  
// use the register function to add data mongodb
// redirect the user to login page
app.post('/register-server', function(req, res, next){
  User.register({fname: req.body.fname, lname: req.body.lname, email: req.body.email, zipcode: req.body.zipcode, username:req.body.username}, req.body.password, function(err){
    if(err){
      console.log('error while user register!', err);
      return next(err);
    } 
    console.log('user registered!');
    res.redirect('/')
  })
})

app.post('/login-server', passport.authenticate('local', {failureRedirect: '/'}), function (req, res){
  //console.log(req.user)
  res.redirect('/private')
})

app.listen(port, ()=> console.log(`This app is listening on port ${port}`));


// npm install passport-local-mongoose mongoose express ejs cookie-session passport express-session connect-ensure-login

