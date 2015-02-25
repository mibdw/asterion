var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');
var task = require(__dirname + '/tasks');
var User = require(__dirname + '/../models/user');
var Cart = require(__dirname + '/../models/cart');


router.post('/detail', task.auth, function (req, res, next) {
	Cart.findById(req.body.id)	
	.populate('books.book')
	.populate('books.user', 'name')
	.populate('owner editor', 'name')
	.exec(function (err, cart) {
		if (err) console.log(err);
		return res.send(cart);
	})
});

router.post('/list', task.auth, function (req, res, next) {
	Cart.find({})
	.select('_id title slug owner created editor edited quantity price')	
	.populate('owner editor', 'name')
	.exec(function (err, carts) {
		if (err) console.log(err);
		return res.send(carts);
	})
});

router.post('/create', task.auth, function (req, res, next) {
	Cart.create({
		title: req.body.title,
		slug: req.body.slug,
		owner: req.user._id,
		created: moment().format(),
	}, function (err, response) {
		if (err) console.log(err);
		return res.send(response);
	});
});

router.post('/update', task.auth, function (req, res, next) {
	var bks = req.body.books;
	var q = 0;
	var p = 0;	

	for (i in bks) {
		q = q + parseInt(bks[i].quantity);
		if (bks[i].book.price > 0) p = p + (parseFloat(bks[i].book.price) * parseInt(bks[i].quantity));
		bks[i].book = bks[i].book._id;
		bks[i].user = bks[i].user._id;

		if (i == bks.length - 1) {
			console.log(bks);
			Cart.findByIdAndUpdate(req.body._id, {
				title: req.body.title,
				slug: req.body.slug,
				books: bks,
				editor: req.user._id,
				edited: moment().format(),
				quantity: q,
				price: p
			}, function (err, response) {
				if (err) console.log(err);
				Cart.findById(response._id)	
				.populate('books.book')
				.populate('books.user', 'name')
				.populate('owner editor', 'name')
				.exec(function (err, cart) {
					if (err) console.log(err);
					return res.send(cart);
				})
			});			
		}
	}

});

router.post('/remove', task.auth, function (req, res, next) {
	Cart.findByIdAndRemove(req.body.id, function (err, response) {
		if (err) console.log(err);
		return res.send(response);
	});
});

router.post('/add', task.auth, function (req, res, next) {
	var add = { 
		'book': req.body.book._id, 
		'quantity': 1,
		'added': moment().format(),
		'user': req.user._id
	};

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
});

router.post('/add', task.auth, function (req, res, next) {
	
});

module.exports.router = router;