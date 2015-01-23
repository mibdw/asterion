var mongoose = require('mongoose');
var moment = require('moment');
var User = require(__dirname + '/../models/user.js');

exports.read = function(req, res, next) {
	var id = req.body.id || req.user._id;

	User.findById(id)
	.select('_id email name confirm accounts')
	.exec(function (err, user) {
		if (err) return console.log(err);
		return res.send(user);
	});
};

exports.list = function(req, res, next) {
	
};

exports.create = function(req, res, next) {
	
};

exports.update = function(req, res, next) {
	req.body['editor'] = req.user._id;
	req.body['edited'] = moment().format();
	
	User.findById(req.body._id, function (err, user) {
		if (req.body.password) {
			var password = req.body.password;
			delete req.body['password'];

			user.setPassword(password, function (err) {
				if (err) return console.log (err);
				user.set(req.body);
				user.save(function (err) {
					if (err) return console.log(err);
					return res.send({'success': true });
				});
			});
		} else {
			user.set(req.body);
			user.save(function (err) {
				if (err) return console.log(err);
				return res.send({'success': true });
			});
		}
	});
};

exports.remove = function(req, res, next) {
	
};