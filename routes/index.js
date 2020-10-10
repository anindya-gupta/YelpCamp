var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user")
//===========REGISTER===========
router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		} 
		else {
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to Yelpcamp Application " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

//=========LOGIN=============
router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
});

//================LOGOUT===================
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You have been successfully logged Out");
	res.redirect("/login");
});
// app.get("*",function(req,res){
// 	console.log("Error, not found... Err..");
// });
function isLoggedIn(req,res,next){
	 if(req.isAuthenticated()){
		 return next();
	 }
	 res.redirect("/login");
}

module.exports = router;
