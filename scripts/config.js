var app = angular.module('asterion', [
	'ngRoute', 
	'ngCookies', 
	'ngSanitize', 
	'highlighter', 
	'global', 
	'drawer', 
	'dashboard', 
	'search', 
	'profile',
]);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/dashboard/main',
		controller: 'dashboardController'
	})
	.when('/search/:query', {
		templateUrl: 'partials/search/results',
		controller: 'searchController'
	})
	.when('/profile', {
		templateUrl: 'partials/profile/index',
		controller: 'profileController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

angular.module('highlighter',[]).filter('highlight', function () {
	return function (text, search, caseSensitive) {
		if (!text) return false;

		text = text.toString();
		search = search.toString();
		search = search.split(' ');

		for (i in search) {
			if (text && (search[i] || angular.isNumber(search[i]))) {
				if (caseSensitive) {
					text = text.split(search[i]).join('<mark>' + search[i] + '</mark>');
				} else {
					text = text.replace(new RegExp(search[i], 'gi'), '<mark>$&</mark>');
				}
			} else {
				text = text;
			}

			if (i ==  search.length - 1) return text;
		}
	};
});

app.factory('focus', function ($timeout) {
	return function (id) {
		$timeout(function () {
			var element = document.getElementById(id);
			if (element) element.focus();
		});
	};
});
