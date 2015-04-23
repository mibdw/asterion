var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');
var task = require(__dirname + '/tasks');
var User = require(__dirname + '/../models/user');

router.post('/read', task.auth, function (req, res, next) {
	var id = req.body.id || req.user._id;

	User.findById(id)
	.select('_id email name confirmation accounts cart select')
	.exec(function (err, user) {
		if (err) return console.log(err);
		return res.send(user);
	});
});

router.post('/list', task.auth, function (req, res, next) {
	
});

router.post('/create', task.auth, function (req, res, next) {
	
});

router.post('/update', task.auth, function (req, res, next) {
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
});

router.post('/remove', task.auth, function (req, res, next) {
	
});

router.post('/cart', task.auth, function (req, res, next) {
	User.findByIdAndUpdate(req.user._id, { 'cart': req.body._id }, function (err, user) {
		if (err) console.log(err);
		return res.send({ 'id': user.cart });
	});	
});


router.post('/selection', task.auth, function (req, res, next) {
	User.findByIdAndUpdate(req.user._id, { 'select': req.body.selection }, function (err, user) {
		if (err) console.log(err);
		return res.send({ 'selection': user.selection })
	});
});

module.exports.router = router;