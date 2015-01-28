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

var users = require(__dirname + '/users.js');
router.post('/users/read', ensAuth, users.read);
router.post('/users/list', ensAuth, users.list);
router.post('/users/create', ensAuth, users.create);
router.post('/users/update', ensAuth, users.update);
router.post('/users/remove', ensAuth, users.remove);

var carts = require(__dirname + '/carts.js');
router.post('/carts/contents', ensAuth, carts.contents);
router.post('/carts/create', ensAuth, carts.create);
router.post('/carts/update', ensAuth, carts.update);
router.post('/carts/remove', ensAuth, carts.remove);
router.post('/carts/add', ensAuth, carts.add);
router.post('/carts/subtract', ensAuth, carts.subtract);

router.get('/partials/:section/:partial', ensAuth, function (req, res) {
	res.render(__dirname + '/../views/' + req.params.section + '/' + req.params.partial + '.html');
});

function ensAuth (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.render(__dirname + '/../views/login.html', { message: false });
} 

module.exports.router = router;