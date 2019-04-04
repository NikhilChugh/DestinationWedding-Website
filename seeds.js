const mongoose = require('mongoose');
const Venue    = require('./models/venues');
const Comment  = require('./models/comments');


const data = [{name: "Ritz Garden", 
               image: "https://media.weddingz.in/images/d50e29fda885ceec7e27ed1e5d5d5cd5/top-10-banquet-halls-in-delhi-ritz-at-ambience-golf-drive-1.jpg",
               description: "This is a grand luxurious banquet hall"
              },
              {name : "Udaipur Resort", 
               image : "https://www.holidify.com/blog/wp-content/uploads/2014/09/oberoi_udaivilas.jpg", 
               description : "Finest resort in rajasthan"
              }
                   ];
                   
                   
function seedDB(){
    //Remove all Venues
    Venue.remove({}, (err) => {
        if(err){
            console.log(err)
        } else {
            console.log("removed venues");
          //  add a few venues
            data.forEach((seed) =>{
                Venue.create(seed, (err, venue) =>{
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a venue");
                        //Create a comment
                        Comment.create(
                            { text: 'This place is great for destination weddings',
                              author: 'BansiLal'
                            }, (err, comment) =>{
                                if(err){
                                    console.log(err);
                                } else {
                                    venue.comments.push(comment);
                                    venue.save();
                                    console.log('Created a new comment');
                                }
                            }
                            
                            );
                    }
                }) 
            })
        }
    })
}

module.exports = seedDB;