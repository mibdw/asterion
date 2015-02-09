var router = require('express').Router();
var passport = require('passport');
var task = require(__dirname + '/tasks');

router.get('/:section/:partial', task.auth, function (req, res) {
	res.render(__dirname + '/../views/' + req.params.section + '/' + req.params.partial + '.html');
});

module.exports.router = router;