var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.render(__dirname + '/../views/index.html');
});

router.get('/partials/:section/:partial', function (req, res) {
	res.render(__dirname + '/../views/' + req.params.section + '/' + req.params.partial + '.html');
});

var search = require(__dirname + '/search.js');
router.post('/search/results', search.results);


module.exports.router = router;