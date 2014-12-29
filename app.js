// Setup 

var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 4242;
var moment = require('moment');

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public')); 

// Routes

app.use('/', require(__dirname + '/handlers/routes.js').router);

// Database

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/asterion');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) { console.log(moment().format('DD-MM-YYYY HH:mm:ss') + ' - Database connected bitch') });

// Go go go!

http.listen(port, function () {
	console.log('\n========\nASTERION\n========\n\n' + moment().format('DD-MM-YYYY HH:mm:ss') + ' - Getting jiggy at port %s', port);
});
