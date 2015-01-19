var express = require('express');
var router = express.Router();
var passport = require('passport');

var auth = require(__dirname + '/auth.js');
router.get('/', ensAuth, auth.main);
router.get('/login', auth.login);
router.post('/login', auth.entry);
router.get('/logout', auth.exit);

var search = require(__dirname + '/search.js');
router.post('/search/results', ensAuth, search.results);

router.get('/partials/:section/:partial', ensAuth, function (req, res) {
	res.render(__dirname + '/../views/' + req.params.section + '/' + req.params.partial + '.html');
});

function ensAuth (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
} 

module.exports.router = router;
