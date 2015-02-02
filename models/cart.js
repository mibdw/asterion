var mongoose = require('mongoose');
var Book = require(__dirname + '/book.js');
var User = require(__dirname + '/user.js');

var cartSchema = mongoose.Schema({
	title: String,
	slug: String,
	owner: { type: String, ref: 'User' },
	created: Date,
	editor: { type: String, ref: 'User' },
	edited: Date,
	books: [{
		book: { type: String, ref: 'Book' },
		quantity: Number,
		reference: String,
		department: String,
		budget: String,
		instructions: String,
		added: Date,
		user: { type: String, ref: 'User' }
	}],
	quantity: Number,
	price: Number
});

module.exports = mongoose.model('Cart', cartSchema);