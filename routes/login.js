var express = require('express');
var router = express.Router();
const passport = require("passport");

	// login view
	router.get('/', (req, res) => {		
		res.render('login.ejs');
	});

	router.post('/', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));
  
module.exports = router;