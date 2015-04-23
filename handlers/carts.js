var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');
var task = require(__dirname + '/tasks');
var User = require(__dirname + '/../models/user');
var Cart = require(__dirname + '/../models/cart');
var Book = require(__dirname + '/../models/book');

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
		quantity: 0,
		price: 0
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
		q = q + Number(bks[i].quantity);
		if (Number(bks[i].book.price) > 0) p = p + (Number(bks[i].book.price) * Number(bks[i].quantity));

		bks[i].book = bks[i].book._id;
		bks[i].user = bks[i].user._id;

		if (i == bks.length - 1) {
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

router.post('/rename', task.auth, function (req, res, next) {

	Cart.findByIdAndUpdate(req.body._id, {
		title: req.body.title,
		slug: req.body.slug,
		editor: req.user._id,
		edited: moment().format(),
	}, function (err, response) {
		if (err) console.log(err);
		return res.send(response);
	});
});

router.post('/remove', task.auth, function (req, res, next) {
	Cart.findByIdAndRemove(req.body.id, function (err, response) {
		if (err) console.log(err);
		return res.send(response);
	});
});

router.post('/add/single', task.auth, function (req, res, next) {
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

		var price = 0;
		if (req.body.book._source) price = Number(req.body.book._source.price);
		if (req.body.book.price) price = Number(req.body.book.price);
		cart.price = cart.price + price;
		cart.editor = req.user._id;
		cart.edited = moment().format();
		
		cart.save(function (err, response) {
			if (err) console.log(err);
			return res.send(response);
		});
	});
});

router.post('/add/multiple', task.auth, function (req, res, next) {

	Cart.findById(req.body.cart, function (err, cart) {
		if (err) console.log(err);

		for (i in req.body.books) {
			var add = { 
				'book': req.body.books[i]._id, 
				'quantity': 1,
				'added': moment().format(),
				'user': req.user._id
			};

			var check = false;
			for (j in cart.books) {
				if (cart.books[j].book == add.book) {
					cart.books[j].quantity++;
					check = true;
				}
			}
			if (check == false) cart.books.push(add);

			cart.quantity = cart.quantity + 1;
			var price = Number(req.body.books[i].price);
			cart.price = cart.price + price;
			
			if (i == req.body.books.length - 1) {
				cart.editor = req.user._id;
				cart.edited = moment().format();

				cart.save(function (err, response) {
					if (err) console.log(err);
					return res.send(response);
				});
			} 

		}
	});
});

module.exports.router = router;