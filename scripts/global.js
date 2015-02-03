var ctrl = angular.module('global', []);

ctrl.controller('globalController', ['$scope', '$rootScope', '$http', '$location', '$timeout',
	function ($scope, $rootScope, $http, $location, $timeout) {
		$rootScope.masthead = 'Asterion';
		$rootScope.titleSep1 = ' \u2012 ';
		$rootScope.titleSep2 = ' \u00AB ';
		$rootScope.titleLine = 'Bookselling like a pro' + $rootScope.titleSep1 + $rootScope.masthead;

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

		$rootScope.searchify = function (text) {
			return text.toString()
			.replace(/\s+/g, '+')
			.replace(/[^\w\+]+/g, '')
			.replace(/\+\++/g, '+')
		} 

		$rootScope.slugify =  function (text) {
			return text.toString().toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w\-]+/g, '')
			.replace(/\-\-+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '')
		}  

		$rootScope.fromNow = function (date) {
			return moment(date).fromNow()
		} 

		$scope.quickSearch = function (searchTerm) {
			searchTerm = $rootScope.searchify(searchTerm);
			$location.path('/search/' + searchTerm);
		}	

		$scope.currentLang = 'en';
		$scope.changeLang = function (tongue) {
			$scope.currentLang = tongue;
		}

		$rootScope.user = {};
		$rootScope.activeCart = {};
		$rootScope.getUser = function () {
			$http.post('/users/read').success(function (user) {
				$rootScope.user = user;
				$rootScope.getActiveCart(user.cart);
			});
		}
		$rootScope.getUser();

		$rootScope.cartsLoading = false;
		$rootScope.cartList = [];
		$rootScope.getCarts = function () {
			$rootScope.cartsLoading = true;
			$http.post('/carts/list').success(function (carts) {
				$rootScope.cartList = carts;
				$rootScope.cartsLoading = false;
			});
		}
		$rootScope.getCarts();

		$rootScope.getActiveCart = function (id) {
			$http.post('/carts/detail', { 'id': id }).success(function (cart) {
				$rootScope.activeCart = cart;
			});
		}

		$rootScope.addingToCart = false;
		$rootScope.addToCart = function (book, cart) {
			$rootScope.addingToCart = book;
			$http.post('/carts/add', { 'book': book, 'cart': cart }).success(function (response) {
				$rootScope.addingToCart = false;
				$rootScope.getActiveCart($rootScope.user.cart);
				$rootScope.getCarts();
			});
		}

		$scope.dropdownCarts = false;
		$scope.cartsDropdown = function (arg) {
			if (arg == false) $timeout(function () { $scope.dropdownCarts = arg }, 250);
			if (arg != false) $scope.dropdownCarts = arg; 
		}
	}
]);