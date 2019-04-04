
const express = require('express');
const router  = express.Router();
const Venue   = require('../models/venues');
const middleware = require('../middleware'); //index.js is a special file and we don't need to specifically link to that file inside middleware to work


// INDEX -- show all venues 
router.get('/', (req, res) => {
  // Get all venues from database
  Venue.find({}, (err, allVenues) => {
    if(err){
      console.log(err);
    } else 
    {   res.render('venues/index', {venues : allVenues, page: 'venues'}); 
      
    }
  });
});

// CREATE -- add new venue to database 
router.post('/', middleware.isLoggedIn, (req, res) => {
  //get data from form and add to venues
  const name  = req.body.name;
  const price = req.body.price;
  const image = req.body.image;
  const desc  = req.body.description;
  const author = {
           id: req.user._id,
           username: req.user.username
  };

    const newVenue = {name: name, price: price, image: image, description: desc, author: author};
  //Create a new venue and save to database
  Venue.create(newVenue, (err, newlyCreated) => {
    if(err){console.log(err);
  }else 
  {  //redirect back to venues page
  res.redirect('/venues');}
});
});


//NEW -- show form to create new venue
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('venues/new');
});

//SHOW -- show more info about one venue
router.get('/:id', (req,res) => {
  Venue.findById(req.params.id).populate('comments').exec((err, foundVenue) => {
    if(err || !foundVenue){
      req.flash("error", "Venue not found");
      res.redirect('back');
    } else {
      console.log(foundVenue);
      //render show template with that venue
      res.render('venues/show', {venue: foundVenue});
    }
  });
});

//EDIT Venue Route
router.get('/:id/edit', middleware.checkVenueOwnership, (req, res) =>{
  Venue.findById(req.params.id, (err, foundVenue) => {
    if(err){
      res.redirect('/venues');
    } else {
    res.render('venues/edit', {venue: foundVenue});
    }
  });
});

//UPDATE Venue Route
router.put('/:id', middleware.checkVenueOwnership, (req, res) =>{
  
  Venue.findByIdAndUpdate(req.params.id, req.body.venue ,(err, updatedVenue) =>{
    if(err){
      res.redirect('/venues');
    } else {
      res.redirect('/venues/' + req.params.id);
    }
  });
});


//DELETE Venue Route
router.delete('/:id', middleware.checkVenueOwnership, (req, res) =>{
  Venue.findByIdAndRemove(req.params.id ,(err) =>{
    if(err){
      res.redirect('/venues');
    } else{
      res.redirect('/venues');
    }
  });
});

module.exports = router; 