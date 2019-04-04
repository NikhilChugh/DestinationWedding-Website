const  express = require('express');
const  router  = express.Router({mergeParams: true});  //'mergeParams' make id visible to this file
const  Venue   = require('../models/venues');
const  Comment = require('../models/comments');
const  middleware = require('../middleware');


router.get('/new', middleware.isLoggedIn, (req, res) => {
  Venue.findById(req.params.id, (err, venue) => {
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {venue: venue});
    }
  });
});
  
router.post('/',middleware.isLoggedIn , (req, res) =>{
  Venue.findById(req.params.id, (err, venue) =>{
    if(err){
      res.redirect('/venues');
    } else {
      Comment.create(req.body.comment, (err,comment) =>{
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          venue.comments.push(comment);
          venue.save();
          req.flash("success", "Successfully added comment");
          res.redirect('/venues/' + venue._id);
        }
        })
      }
      
  })
})

//EDIT Comment Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) =>{
   Venue.findById(req.params.id, function(err, foundVenue){
        if(err || !foundVenue){
            req.flash("error", "No venue found");
            return res.redirect("back");
        }
   Comment.findById(req.params.comment_id, (err, foundComment) =>{
     if(err){
       res.redirect('back');
     } else {
       res.render('comments/edit', {venue_id: req.params.id, comment: foundComment});
     }
   });
});
});

//UPDATE Comment Route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) =>{
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/venues/' + req.params.id);
    }
});
});

//DELETE Comment Route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) =>{
  Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
    if(err){
      res.redirect('back');
    } else {
      req.flash("success", "Comment deleted");
      res.redirect('/venues/' + req.params.id)
    }
  });
});





module.exports = router; 

