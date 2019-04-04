const express          = require('express'),
      app              = express(),
      bodyParser       = require('body-parser'),
      mongoose         = require('mongoose'),
      flash            = require('connect-flash'),
      passport         = require('passport'),
      LocalStrategy    = require('passport-local'),
      methodOverride   = require('method-override'),
      Venue            = require('./models/venues'),
      Comment          = require('./models/comments'),
      User             = require('./models/user'),
      seedDB           = require('./seeds');

//Accessing map through mapbox


     
//requiring routes
const commentRoutes     = require('./routes/comments'),
      venueRoutes       = require('./routes/venues'),
      indexRoutes       = require('./routes/index');
      
mongoose.connect("mongodb://localhost:27017/marriage_venues", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Weddings are made in heaven',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {              //This is available in every route
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();                                     //next() is a middleware that runs on every route
});

app.use(indexRoutes);
app.use('/venues',venueRoutes);
app.use('/venues/:id/comments', commentRoutes);


app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Server get started');
});
