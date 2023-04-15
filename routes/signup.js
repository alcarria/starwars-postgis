var express = require('express');
var router = express.Router();
const passport = require("passport");

	// signup view
	router.get('/', (req, res) => { 
		res.render('signup');
	});

	router.post('/', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup'		
	}));

module.exports = router;