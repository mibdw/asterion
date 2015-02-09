var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');
var task = require(__dirname + '/tasks');

router.get('/', task.auth, function (req, res, next) {
	res.render(__dirname + '/../views/index.html');
});

router.get('/login', function (req, res, next) {
	res.render(__dirname + '/../views/login.html', { message: false });
});

router.post('/login', function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) return next(err);
		if (!user) return res.render(__dirname + '/../views/login.html', { message: info.message });
		req.logIn(user, function (err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	})(req, res, next);
});

router.get('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/');
});

module.exports.router = router;