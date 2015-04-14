var ctrl = angular.module('selection', []);

ctrl.controller('selectionController', ['$scope', '$rootScope', '$http', '$cookieStore',
	function ($scope, $rootScope, $http, $cookieStore) {

		$scope.selectionCarts = false;
		$rootScope.selectUrl = '/partials/selection/main';

		$rootScope.initSelection = function () {
			$rootScope.selectedTitles = {
				page: '',
				source: '',
				slug: '',
				id: '',
				books: []
			};
			$cookieStore.put('selectedTitles', $rootScope.selectedTitles);
		}	

		if ($cookieStore.get('selectedTitles')) {
			$rootScope.selectedTitles = $cookieStore.get('selectedTitles');
			console.log($rootScope.selectedTitles);
		} else {
			$rootScope.initSelection();
		}

		$rootScope.selectTitle = function (book, page, source) {

			if ($rootScope.selectedTitles.source != source) $rootScope.initSelection();
			$rootScope.selectedTitles.source = source;
			$rootScope.selectedTitles.page = page;
			
			if ($rootScope.selectedTitles.books.indexOf(book._id) < 0) {
				$rootScope.selectedTitles.books.push(book._id);
			} else {
				$rootScope.selectedTitles.books.splice($rootScope.selectedTitles.books.indexOf(book._id), 1);
			}

			$cookieStore.put('selectedTitles', $rootScope.selectedTitles);
		}

		$rootScope.addSelectionToCart = function (books, cart) {
			$rootScope.addingSelectionToCart = true;

			$http.post('/carts/selection', { 'books': books, 'cart': cart }).success(function (response) {
				$rootScope.getActiveCart($rootScope.user.cart);
				$rootScope.getCarts();

				$timeout(function () {
					$rootScope.addingSelectionToCart = false;
					$rootScope.addedSelectionToCart = true;

					$timeout(function () {
						$rootScope.addedSelectionToCart = false;
						$rootScope.initSelection();
					}, 2000);
				}, 1000);
			});
		}
	}
]);