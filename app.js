// Requirements 
var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 4242;

var mongoose = require('mongoose');
var moment = require('moment');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require(__dirname + '/models/user');

// Engines
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ keys: [
	'Nobody fucks with the Jesus', 
	'Eight years old dude', 
	'Obviously you\'re not a golfer']}));

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require(__dirname + '/handlers/auth').router);
app.use('/partials', require(__dirname + '/handlers/partials').router);
app.use('/users', require(__dirname + '/handlers/users').router);
app.use('/search', require(__dirname + '/handlers/search').router);
app.use('/detail', require(__dirname + '/handlers/detail').router);
app.use('/carts', require(__dirname + '/handlers/carts').router);

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database
mongoose.connect('mongodb://localhost/asterion');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'You\'re out of your element, Donny:\n'));
db.once('open', function (callback) { console.log(moment().format('DD-MM-YYYY HH:mm:ss') + ' - That database really ties the room together') });

// Launch server
http.listen(port, function () {
	console.log('\n========\nASTERION\n========\n\n' + moment().format('DD-MM-YYYY HH:mm:ss') + ' - Fuck it, let\'s go bowling at port %s', port);
});

// Seed User
User.find({}, function (err, result) {
	if (result.length < 1) {
		var seedEmail = 'maarten@erasmusbooks.nl';
		var seedPassword = 'secret';
		User.register(new User({ email: seedEmail }), seedPassword, function(err) {
			
			if (err) { 
					console.log('Could not seed initial user:\n', err); 
					return next(err); 
				}
				
			console.log(moment().format('DD-MM-YYYY HH:mm:ss') + ' - Welcome to Asterion, we seeded the initial user for you.');
			console.log(moment().format('DD-MM-YYYY HH:mm:ss') + ' - Please login with e-mail: \'admin@asterion.club\' and password \'secret\'.');
			console.log(moment().format('DD-MM-YYYY HH:mm:ss') + ' - We strongly advise changing these immediately after login!!!');
		});
	}
});