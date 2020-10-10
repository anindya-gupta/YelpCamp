var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
const mongoose = require('mongoose');
var session    = require('express-session');
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var User 	   = require("./models/user");
var Campground = require("./models/campground");
var seedDB     = require("./seed");
var Comment    = require("./models/comment");
var flash      = require("connect-flash");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes      = require("./routes/index")//requring routes

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
//seedDB();
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(methodOverride("_method"));
app.use(session({secret: 'keyboard cat'}))
app.use(passport.session());
app.use(flash());
app.use(require("express-session")({
	secret:"This is my secret code",
	resave:false,
	saveUninitialized:false
}));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error=req.flash("error");
   res.locals.success= req.flash("success");
   next();
});


app.get("/",function(req,res){
	res.render("landing");
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000,function(){
	console.log("Port is On");
});