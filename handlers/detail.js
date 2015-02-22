var router = require('express').Router();
var mongoose = require('mongoose');
var moment = require('moment');
var task = require(__dirname + '/tasks');
var Book = require(__dirname + '/../models/book');

router.post('/id', task.auth, function (req, res, next) {
	Book.findById(req.body.id)
	.exec(function (err, detail) {
		if (err) console.log(err);
		return res.send(detail);
	})
});
	
module.exports.router = router;