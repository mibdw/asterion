var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var itemSchema = mongoose.Schema({
	author: String,
	title: String,
	isbn: Number,
	publisher: String,
	price: String,
	currency: Number,
	status: Number,
	pages: Number,
	country: String,
	date: String,
	group: Number,
	place: String
});

itemSchema.plugin(mongoosastic);

module.exports = mongoose.model('Item', itemSchema);