var mongoose = require('mongoose');
var moment = require('moment');
var passport = require('passport');

exports.main = function(req, res, next) {
	res.render(__dirname + '/../views/index.html');
};

exports.login = function(req, res, next) {
	res.render(__dirname + '/../views/login.html', { message: false });
};

exports.entry = function(req, res, next) {
	
	passport.authenticate('local', function (err, user, info) {
		if (err) return next(err);
		if (!user) return res.render(__dirname + '/../views/login.html', { message: info.message });
		req.logIn(user, function (err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	})(req, res, next);
};

exports.exit = function(req, res, next) {
	req.logout();
	res.redirect('/');
};