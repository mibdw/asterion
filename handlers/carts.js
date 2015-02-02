var mongoose = require('mongoose');
var moment = require('moment');
var User = require(__dirname + '/../models/user.js');
var Cart = require(__dirname + '/../models/cart.js');

exports.detail = function(req, res, next) {
	
};

exports.list = function(req, res, next) {
	Cart.find({})
	.select('_id title owner created editor edited quantity price')	
	.populate('owner editor', 'name')
	.exec(function (err, carts) {
		if (err) console.log(err);
		return res.send(carts);
	})
};

exports.create = function(req, res, next) {
	Cart.create({
		title: req.body.title,
		owner: req.user._id,
		created: moment().format(),
		quantity: 0,
		price: 0
	}, function (err, response) {
		if (err) console.log(err);
		return res.send(response);
	});
};

exports.update = function(req, res, next) {
	
};

exports.remove = function(req, res, next) {
	Cart.findByIdAndRemove(req.body.id, function (err, response) {
		if (err) console.log(err);
		return res.send(response);
	});
};

exports.add = function(req, res, next) {
	
};

exports.subtract = function(req, res, next) {
	
};