var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Cart = require(__dirname + '/cart.js');

var userSchema = mongoose.Schema({
	email: { type: String, unique: true },
	password: String,
	name: {
		first: String,
		last: String,
	},
	active: { type: Boolean, default: true },
	creator: String,
	created: Date,
	editor: String,
	edited: Date,
	accounts: [String],
	lang: { type: String, default: 'en' },
	confirmation: { type: Boolean, default: true },
	cart: String
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);