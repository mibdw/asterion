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

		$rootScope.slugify = function (text) {
			return text.toString()
			.replace(/\s+/g, '+') // Replace spaces with -
			.replace(/[^\w\+]+/g, '') // Remove all non-word chars
			.replace(/\+\++/g, '+') // Replace multiple - with single -
		} 

		$scope.quickSearch = function (searchTerm) {
			searchTerm = $rootScope.slugify(searchTerm);
			$location.path('/search/' + searchTerm);
		}	

		$scope.cartsDropdown = {
			active: false,
			loading: false,
			carts: [
				{ 
					title: 'Shipping cart title',
					amount: 12,
					price: 82.12
				},
				{ 
					title: 'Lost in the dream',
					amount: 31,
					price: 33.12
				},
				{ 
					title: 'Especially for you',
					amount: 2,
					price: 9.00
				},
				{ 
					title: 'Cart 3',
					amount: 7,
					price: 28.09
				},
				{ 
					title: 'Because you\'re too old, stupid moron',
					amount: 4,
					price: 849.12
				},
				{ 
					title: 'Kisses',
					amount: 3,
					price: 63.22
				},
				{ 
					title: 'Migraines',
					amount: 102,
					price: 993.21
				},
			]
		}

		$scope.focusCarts = function (item) {
			$scope.cartsDropdown['active'] = item._id;
		}

		$scope.blurCarts = function (item) {
			$scope.cartsDropdown['active'] = false;
		}
	}
]);