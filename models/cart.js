var mongoose = require('mongoose');
var Book = require(__dirname + '/book.js');

var cartSchema = mongoose.Schema({
	title: String,
	owner: String,
	created: Date,
	editor: String,
	edited: Date,
	books: [{
		book: { type: String, ref: 'Book' },
		quantity: Number,
		reference: String,
		department: String,
		budget: String,
		instructions: String,
		added: Date,
		user: String
	}],
	total: Number
});

module.exports = mongoose.model('Cart', cartSchema);