var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public')); 

app.get('/', function (req, res) {

	res.sendFile(__dirname + '/views/index.html');

});

var server = http.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Getting jiggy at http://%s:%s', host, port);

});
