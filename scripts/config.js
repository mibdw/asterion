var app = angular.module('asterion', [ 
	'ngRoute', 'ngCookies', 'ngSanitize', 'global', 'drawer', 'dashboard', 'search', 'detail', 'carts', 'advanced', 'outside', 'isbn', 'tracing', 'standing', 'nts', 'approval', 'profile', 'help'
]);

// Routes
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/dash/main',
		controller: 'dashboardController'
	})
	.when('/search/:query', {
		templateUrl: 'partials/search/results',
		controller: 'searchController'
	})
	.when('/detail/:slug/:id', {
		templateUrl: 'partials/detail/main',
		controller: 'detailController'
	})
	.when('/cart/:slug/:id', {
		templateUrl: 'partials/cart/main',
		controller: 'cartController'
	})
	.when('/advanced-search', {
		templateUrl: 'partials/advanced/main',
		controller: 'advancedController'
	})
	.when('/order-outside-database', {
		templateUrl: 'partials/outside/main',
		controller: 'outsideController'
	})
	.when('/isbn-upload', {
		templateUrl: 'partials/isbn/main',
		controller: 'isbnController'
	})
	.when('/order-tracing', {
		templateUrl: 'partials/tracing/main',
		controller: 'tracingController'
	})
	.when('/standing-orders', {
		templateUrl: 'partials/standing/main',
		controller: 'standingController'
	})
	.when('/new-title-service', {
		templateUrl: 'partials/nts/main',
		controller: 'ntsController'
	})
	.when('/approval-plans', {
		templateUrl: 'partials/approval/main',
		controller: 'approvalController'
	})
	.when('/profile', {
		templateUrl: 'partials/profile/main',
		controller: 'profileController'
	})
	.when('/help', {
		templateUrl: 'partials/help/main',
		controller: 'helpController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

// Filters
app.filter('highlight', function () {
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
			} else { text = text; }
			if (i ==  search.length - 1) return text;
		}
	};
});

// Factories
app.factory('focus', function ($timeout) {
	return function (id) {
		$timeout(function () {
			var element = document.getElementById(id);
			if (element) element.focus();
		});
	};
});

app.factory('searchify', function () {
	return function (text) {
		return text.toString()
		.replace(/\s+/g, '+')
		.replace(/[^\w\+]+/g, '')
		.replace(/\+\++/g, '+')
	} 
});

app.factory('slugify', function () {
	return function (text) {
		return text.toString().toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
	} 
});

angular.element(document).ready(function () {
	var header = $('body > header').outerHeight();
	var subheader = $('.subheader').outerHeight();
	var footer =  $('.container > footer').outerHeight();
	var top = $('.container').scrollTop();
	var direction = 'down';
	var marginTop = 0;
	
	$('.container').scroll(function () {
		if ($('.container').scrollTop() > top) { direction = 'down' } 
		else if ($('.container').scrollTop() < top) { direction = 'up' }
		
		top = $('.container').scrollTop();
		var container = $('#main').outerHeight();
		var aside = $('.sticky').outerHeight();
		var viewport = $(window).height() - header;

		if (top < subheader) { marginTop = 0 } 
		else if (top > subheader) {
			if (aside < viewport) {

				if (top - subheader < container - aside) { marginTop = top - subheader } 
				else { marginTop = container - aside }

			} else if (aside >= viewport) {

				if (direction == 'down') {
					if ((top - subheader) > (container - viewport)) {
						marginTop = marginTop;
					} else if ((top - marginTop) > (aside - viewport + subheader)) {
						if (top - subheader > aside - viewport) { 
							marginTop = (top - subheader) - (aside - viewport)
						}  
					}
				} else if (direction == 'up') {
					if (marginTop > top - subheader) marginTop = top - subheader;	
				}
			}
		}
		$('.sticky').css('margin-top', marginTop); 
	});
});