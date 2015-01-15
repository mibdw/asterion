var mongoose = require('mongoose');
var moment = require('moment');
var es = require('elasticsearch');
var elastic = new es.Client({ host: 'localhost:9200' });

var Book = require(__dirname + '/../models/book.js');

exports.results = function(req, res, next) {

	function launchSearch (payload) {	
		elastic.search(payload).then(function (response) { 
			return res.send(response); 
		}, function (err) {
			console.log(err);
		});
	}

	var conditions = {
		'index': 'bookz',
		'type': 'book',
		'from': req.body.page * req.body.limit,
		'size': req.body.limit,
		'body': {
			'query': {
				'query_string': { 'query': req.body.search }
			},
			'post_filter': {},
			'aggs': {
				'countries' : {
					'terms': { 'field' : 'country' }
				},
				'availability': { 'terms': { 'field': 'status' }},
				'binding': { 'terms': { 'field': 'group' }}
			},
			'sort': [],
		}
	};

	if (req.body.sort != 'relevance') {
		var sorting = {}
		sorting[req.body.sort] = { 'order': req.body.order };
		conditions['body']['sort'].push(sorting);
	}

	var filters = { 'bool': { 'must': []}};
	var masterFilter = false;

	if (req.body.filter['group'].length > -1) {
		var groups = { 'bool': { 'should': [] }}
		req.body.filter['group'].forEach(function (arg) {
			groups['bool']['should'].push({'term': {'group': arg}});
		});

		filters['bool']['must'].push(groups);
	}

	if (req.body.filter['status'].length > -1) {
		var statuses = { 'bool': { 'should': [] }}
		req.body.filter['status'].forEach(function (arg) {
			statuses['bool']['should'].push({'term': {'status': arg}});
		});

		filters['bool']['must'].push(statuses);
	}

	if (req.body.filter['country'].length > -1) {
		var countries = { 'bool': { 'should': [] }}
		req.body.filter['country'].forEach(function (arg) {
			countries['bool']['should'].push({'term': {'country': arg}});
		});

		filters['bool']['must'].push(countries);
	}

	if (filters['bool']['must'].length > 0) conditions['body']['post_filter'] = filters;

	launchSearch(conditions);
};