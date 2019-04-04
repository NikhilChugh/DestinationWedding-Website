const Venue    = require('../models/venues');
const Comment  = require('../models/comments');

const middlewareObj = {};

middlewareObj.checkVenueOwnership = (req, res, next) =>{
    if(req.isAuthenticated()){
        Venue.findById(req.params.id, (err, foundVenue) =>{
            if(err || !foundVenue){
                req.flash("error", "Campground not found");
                res.redirect('back');
               } else{
                 //does user own the venue
                 //we can't compare mongoose id with user id using '===' sign, so we have to use mongoose built-in method 'equals'
                 //foundVenue.author.id is string behind the scenes
                 if(foundVenue.author.id.equals(req.user._id)){
                     next();
                 } else {
                     res.redirect('back')
                 }
               }
        }); 
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect('back');
    }
};


middlewareObj.checkCommentOwnership = (req, res, next)=>{
   if(req.isAuthenticated()){
       Comment.findById(req.params.comment_id, (err, foundComment)=>{
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect('back');
           } else {
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect('back');              
                   }
           }
       })
   } else {
       req.flash("error", "You need to be logged in to do that");
       res.redirect('back');
   }   
};


middlewareObj.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
       return next();
    } else {
        req.flash("error", "You need to be logged in do that");
        res.redirect('/login');
    }
};

module.exports = middlewareObj;