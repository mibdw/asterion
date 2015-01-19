var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

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
	accounts: [String]
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);