var mongoose = require('mongoose');
var User = require(__dirname + '/user.js');

var cartSchema = mongoose.Schema({
	customer_no: Number,
	name1: String,
	name2: String,
	name3: String,
	name3: String,
	department: String,
	contacts: [{
		name: {
			first: String,
			last: String
		},
		title: String
	}],
	address: {
		street: String,
		number: String,
		city: String,
		postal: String,
		state: String,
		country: String,
		phone: [String],
		fax: [String],
		email: [String]
	},
	owner: { type: String, ref: 'User' },
	created: Date,
	editor: { type: String, ref: 'User' },
	edited: Date,
});

module.exports = mongoose.model('Account', accountSchema);
