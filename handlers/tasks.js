exports.auth = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.render(__dirname + '/../views/login.html', { message: false });
};

exports.slugify = function (text) {
	return text.toString().toLowerCase()
	.replace(/\s+/g, '-')
	.replace(/[^\w\-]+/g, '')
	.replace(/\-\-+/g, '-')
	.replace(/^-+/, '')
	.replace(/-+$/, '')
}