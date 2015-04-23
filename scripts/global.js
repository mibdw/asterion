var ctrl = angular.module('global', []);

ctrl.controller('globalController', ['$scope', '$rootScope', '$http', '$location', '$timeout', '$cookieStore', 'focus', 'searchify', 'slugify',
	function ($scope, $rootScope, $http, $location, $timeout, $cookieStore, focus, searchify, slugify) {
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

		$scope.menuServices = [
			{'name': 'Standing orders and journals', 'slug': 'standing-orders' },
			{'name': 'New title service', 'slug': 'new-title-service' },
			{'name': 'Approval plans', 'slug': 'approval-plans' }
		];
		
		$scope.menuOrders = [
			{'name': 'Order tracing', 'slug': 'order-tracing' },
			{'name': 'Cart manager', 'slug': 'cart-manager' },
			{'name': 'Price quotations', 'slug': 'price-quotations' }
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

		$rootScope.fromNow = function (date) {
			return moment(date).fromNow()
		} 

		$scope.clickSearch = function () {
			focus('search');
		}

		$scope.quickSearch = function (searchTerm) {
			searchTerm = searchify(searchTerm);
			$location.path('/search/' + searchTerm);
		}	

		$scope.currentLang = 'en';
		$scope.changeLang = function (tongue) {
			$scope.currentLang = tongue;
		}

		$scope.menuEntered = false;
		$scope.menuEnter = function ($event, arg) {
			if ($event.keyCode == 40 && arg == false) {
				$scope.menuEntered = true;
				$event.preventDefault();
				focus('menu-0');	
			}
		}

		$scope.menuNav = function ($event, arg) {
			if ($event.keyCode == 40) {
				$event.preventDefault();
				var i = 'menu-' + (arg + 1);
				focus(i);	
			} else if ($event.keyCode == 38) {
				$event.preventDefault();
				if (arg == 0) {
					$scope.menuEntered = false;
					focus('menu-top');	
				} else {	
					var i = 'menu-' + (arg - 1);
					focus(i);	
				}
			} else if ($event.keyCode == 13) {
				$scope.menuEntered = false;
				focus('');
			}
		}

		$rootScope.user = {};
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
				$rootScope.cartList.forEach(function (cart) {
					cart['slug'] = slugify(cart.title);
				});
			});
		}
		$rootScope.getCarts();

		$rootScope.loadingActiveCart = false;
		$rootScope.activeCart = {};
		$rootScope.getActiveCart = function (id) {
			$rootScope.loadingActiveCart = true;
			$http.post('/carts/detail', { 'id': id }).success(function (cart) {
				$rootScope.activeCart = cart;
				$rootScope.loadingActiveCart = false;
				$rootScope.activeCart.books.forEach(function (item) {
					item.book['slug'] = slugify(item.book.title);
				});
			});
		}

		$rootScope.addingToCart = false;
		$rootScope.addedToCart = false;
		$rootScope.addToCart = function (book, cart) {
			$rootScope.addingToCart = book;

			$http.post('/carts/add/single', { 'book': book, 'cart': cart }).success(function (response) {
				$rootScope.getActiveCart($rootScope.user.cart);
				$rootScope.getCarts();

				$timeout(function () {
					$rootScope.addingToCart = false;
					$rootScope.addedToCart = book;

					$timeout(function () {
						$rootScope.addedToCart = false;
					}, 3000);
				}, 750);
			});
		}

		$scope.dropdownCarts = false;
		$scope.cartsDropdown = function (arg) {
			if (arg == false) $timeout(function () { $scope.dropdownCarts = arg }, 250);
			if (arg != false) $scope.dropdownCarts = arg; 
		}

		$rootScope.reloadEverything = function () {
			$rootScope.getCarts();
			$rootScope.getActiveCart($rootScope.user.cart);
		}

		$rootScope.checkIfSelected = function (book) {
			angular.forEach($rootScope.selectedTitles.books, function (obj) {
				if (obj._id == book._id);
			});
		}
	}
]);