var ctrl = angular.module('selection', []);

ctrl.controller('selectionController', ['$scope', '$rootScope', '$http', '$cookieStore', '$timeout',
	function ($scope, $rootScope, $http, $cookieStore, $timeout) {

		$scope.selectionCarts = false;
		$scope.selectionCartsToggle = function (toggle) {
			if (toggle == true) $scope.selectionCarts = true;
			if (toggle == false) {
				$timeout(function () {
					$scope.selectionCarts = false;
				}, 250);
			}
		}
		$rootScope.selectUrl = '/partials/selection/main';

		$rootScope.initSelection = function () {
			$rootScope.user.select = {
				page: '',
				source: '',
				slug: '',
				id: '',
				books: [],
				selection: [],
			};
			$http.post('/users/selection', { 'selection': $rootScope.user.select });
		}	

		$rootScope.selectTitle = function (book, page, source) {

			if ($rootScope.user.select.source != source) $rootScope.initSelection();
			$rootScope.user.select.source = source;
			$rootScope.user.select.page = page;
			
			if ($rootScope.user.select.books.indexOf(book._id) < 0) {
				$rootScope.user.select.books.push(book._id);
				$rootScope.user.select.selection.push(book);
			} else {
				$rootScope.user.select.books.splice($rootScope.user.select.books.indexOf(book._id), 1);
				for (i in $rootScope.user.select.selection) {
					if ($rootScope.user.select.selection[i]._id == book._id)
					$rootScope.user.select.selection.splice(i, 1);
				}
			}

			$http.post('/users/selection', { 'selection': $rootScope.user.select });
		}

		$rootScope.addSelectionToCart = function (books, cart) {
			$rootScope.addingSelectionToCart = true;

			$http.post('/carts/add/multiple', { 'books': books, 'cart': cart }).success(function (response) {
				$rootScope.getActiveCart($rootScope.user.cart);
				$rootScope.getCarts();

				$timeout(function () {
					$rootScope.addingSelectionToCart = false;
					$rootScope.addedSelectionToCart = true;

					$timeout(function () {
						$rootScope.addedSelectionToCart = false;
						$rootScope.initSelection();
					}, 2000);
				}, 1250);
			});
		}
	}
]);