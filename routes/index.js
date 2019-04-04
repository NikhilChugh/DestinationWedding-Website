const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
const User      = require('../models/user');



//Root Route
router.get('/', (req, res) => {
  res.render('landing');
    });


//===============================
//AUTH ROUTES
//===============================

//show register form
router.get('/register', (req, res) =>{
  res.render('register', {page: 'signup'});
});

//handle sign up logic
router.post('/register', (req, res) =>{
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      return res.render('register',{error: err.message});
      }
      passport.authenticate('local')(req, res, () =>{
        req.flash("success", "Welcome to MarriageVenue" + user.username);
        res.redirect('/venues');
      });
  });
});

//show login form
router.get('/login', (req, res) => {
  res.render('login' ,{page: 'login'});
});

//handle login logic
router.post('/login', passport.authenticate('local',
                {successRedirect: '/venues',
                 failureRedirect: '/login'
                }), (req, res) => {
      });
      
//logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect('/venues');
});

//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;