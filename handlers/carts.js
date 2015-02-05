var mongoose = require('mongoose');
var moment = require('moment');
var User = require(__dirname + '/../models/user.js');
var Cart = require(__dirname + '/../models/cart.js');

exports.detail = function(req, res, next) {
	Cart.findById(req.body.id)	
	.populate('owner editor', 'name')
	.populate('books.book')
	.populate('books.user')
	.exec(function (err, cart) {
		if (err) console.log(err);
		return res.send(cart);
	})
};

exports.list = function(req, res, next) {
	Cart.find({})
	.select('_id title slug owner created editor edited quantity price')	
	.populate('owner editor', 'name')
	.exec(function (err, carts) {
		if (err) console.log(err);
		return res.send(carts);
	})
};

exports.create = function(req, res, next) {
	Cart.create({
		title: req.body.title,
		slug: req.body.slug,
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
	var add = { 
		'book': req.body.book._id, 
		'quantity': 1,
		'added': moment().format(),
		'user': req.user._id
	};
	// 	
	Cart.findById(req.body.cart, function (err, cart) {
		if (err) console.log(err);

		var check = false;
		for (i in cart.books) {
			if (cart.books[i].book == add.book) {
				cart.books[i].quantity++;
				check = true;
			}
		}
		if (check == false) cart.books.push(add);

		cart.quantity = cart.quantity + 1;
		
		cart.save(function (err, response) {
			if (err) console.log(err);
			return res.send(response);
		});
	});
};

exports.subtract = function(req, res, next) {
	
};

function slugify (text) {
	return text.toString().toLowerCase()
	.replace(/\s+/g, '-')
	.replace(/[^\w\-]+/g, '')
	.replace(/\-\-+/g, '-')
	.replace(/^-+/, '')
	.replace(/-+$/, '')
}
