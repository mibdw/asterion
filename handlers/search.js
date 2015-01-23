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
				'status' : {
					'filter': {},
					'aggs': { 'set': { 'terms': { 
						'field' : 'status',
						'size': 0
					}}}
				},
				'group' : {
					'filter': {},
					'aggs': { 'set': { 'terms': { 
						'field' : 'group',
					}}}
				},
				'country' : {
					'filter': {},
					'aggs': { 'set': { 'terms': { 
						'field' : 'country',
						'size': 25 
					}}}
				}
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
	var masterSet = false;

	if (req.body.filter['group'].length > -1) {
		var groups = { 'bool': { 'should': [] }};
		var setGroup = { 'terms': { 'group': []}};

		req.body.filter['group'].forEach(function (arg) {
			groups['bool']['should'].push({'term': {'group': arg}});

			if (masterSet == false || masterSet == 'group') {
				masterSet = 'group';
				setGroup['terms']['group'].push(arg);
			}
		});

		if (setGroup['terms']['group'].length > 0) {
			conditions['body']['aggs']['country']['filter'] = setGroup;
			conditions['body']['aggs']['status']['filter'] = setGroup;
		}
		filters['bool']['must'].push(groups);
	}

	if (req.body.filter['status'].length > -1) {
		var statuses = { 'bool': { 'should': [] }};
		var setStatus = { 'terms': { 'status': []}};

		req.body.filter['status'].forEach(function (arg) {
			statuses['bool']['should'].push({'term': {'status': arg}});

			if (masterSet == false || masterSet == 'status') {
				masterSet = 'status';
				setStatus['terms']['status'].push(arg);
			}
		});

		if (setStatus['terms']['status'].length > 0) {
			conditions['body']['aggs']['country']['filter'] = setStatus;
			conditions['body']['aggs']['group']['filter'] = setStatus;
		}
		filters['bool']['must'].push(statuses);
	}

	if (req.body.filter['country'].length > -1) {
		var countries = { 'bool': { 'should': [] }};
		var setCountry = { 'terms': { 'country': []}};

		req.body.filter['country'].forEach(function (arg) {
			countries['bool']['should'].push({'term': {'country': arg}});

			if (masterSet == false || masterSet == 'country') {
				masterSet = 'country';
				setCountry['terms']['country'].push(arg);
			}
		});

		if (setCountry['terms']['country'].length > 0) {
			conditions['body']['aggs']['status']['filter'] = setCountry;
			conditions['body']['aggs']['group']['filter'] = setCountry;
		}		
		filters['bool']['must'].push(countries);
	}

	if (filters['bool']['must'].length > 0) conditions['body']['post_filter'] = filters;

	launchSearch(conditions);
};