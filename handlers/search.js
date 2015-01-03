var mongoose = require('mongoose');
var moment = require('moment');
var Item = require(__dirname + '/../models/item.js');

exports.results = function(req, res, next) {
	var query = { 'query_string': { 'query': req.body.search } };

	var conditions = {
		'from': req.body.page * req.body.limit, 
		'size': req.body.limit
	};

	if (req.body.sort != 'relevance') conditions['sort'] = req.body.sort + ':' + req.body.order;

	Item.search(query, conditions, function(err, results) {
		if (err) return console.log(err);
		return res.send(results);
	});

	/*conditions = { $or: [
		{ title: new RegExp(req.body.search, 'i') },
		{ author: new RegExp(req.body.search, 'i') },
		{ publisher: new RegExp(req.body.search, 'i') }
	]};

	Item.find(conditions)
	.limit(req.body.limit)
	.sort(req.body.sort)
	.skip(req.body.page * req.body.limit)
	.exec(function (err, data) {
		if (err) console.log(err);

		Item.count({ title: new RegExp(req.body.search, 'i') }, function (err, count) {
			if (err) console.log(err);
			return res.send({
				'count': count, 
				'data': data,
				'term': req.body.search 
			});
		});
	});*/
};