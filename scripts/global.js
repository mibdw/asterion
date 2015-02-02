var ctrl = angular.module('global', []);

ctrl.controller('globalController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.masthead = 'Asterion';
		$rootScope.titleSep1 = ' \u2012 ';
		$rootScope.titleSep2 = ' \u00AB ';
		$rootScope.titleLine = 'Bookselling like a pro' + $rootScope.titleSep1 + $rootScope.masthead;


		$scope.currentLang = 'en';
		$scope.changeLang = function (tongue) {
			$scope.currentLang = tongue;
		}

		$rootScope.searchTerm;

		$scope.menuSearch = [
			{'name': 'Advanced search', 'slug': 'advanced-search' },
			{'name': 'Outside database', 'slug': 'order-outside-database' },
			{'name': 'ISBN upload', 'slug': 'isbn-upload' },
		];
		
		$scope.menuOrders = [
			{'name': 'Order tracing', 'slug': 'order-tracing' },
			{'name': 'Standing orders and journals', 'slug': 'standing-orders' },
			{'name': 'New title service', 'slug': 'new-title-service' },
			{'name': 'Approval plans', 'slug': 'approval-plans' },
		];

		$scope.menuUser = [
			{'name': 'Profile', 'slug': 'profile' },
			{'name': 'Language', 'sub': [
				{'code': 'en', 'name': 'English'},
				{'code': 'de', 'name': 'Deutsch'},
				{'code': 'fr', 'name': 'Français'},
				{'code': 'nl', 'name': 'Nederlands'},
				{'code': 'es', 'name': 'Español'},
				{'code': 'it', 'name': 'Italiano'},
			]},
			{'name': 'Help', 'slug': 'help' },
		];

		$rootScope.searchify = function (text) {
			return text.toString()
			.replace(/\s+/g, '+')
			.replace(/[^\w\+]+/g, '')
			.replace(/\+\++/g, '+')
		} 

		$rootScope.fromNow = function (date) {
			return moment(date).fromNow()
		} 

		$scope.quickSearch = function (searchTerm) {
			searchTerm = $rootScope.searchify(searchTerm);
			$location.path('/search/' + searchTerm);
		}	

		$rootScope.cartList = [];
		$rootScope.getCarts = function () {
			$http.post('/carts/list').success(function (carts) {
				$rootScope.cartList = carts;
			});
		}
		$rootScope.getCarts();

		$scope.activeCart = {
			'title': 'Shopping cart title',
			'quantity': 12,
			'price': 999.99,
			'owner': 'Harry Turtle',
			'created':  '2 months ago',
			'editor': 'Harry Turtle',
			'edited': '2 seconds ago'
		}

		$scope.dropdownCarts = false;
	}
]);