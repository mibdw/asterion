var ctrl = angular.module('global', []);

ctrl.controller('globalController', ['$scope', '$rootScope', '$http', '$location', '$route',
	function ($scope, $rootScope, $http, $location, $route) {
		$rootScope.masthead = 'Asterion';
		$rootScope.titleSep1 = ' \u2014 ';
		$rootScope.titleSep2 = ' \u00BB ';
		$rootScope.titleLine = 'Bookselling like a pro' + $rootScope.titleSep1 + $rootScope.masthead;
		$rootScope.searchTerm;

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