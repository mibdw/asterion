var ctrl = angular.module('carts', []);

ctrl.controller('cartController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$cookieStore', '$timeout', 'slugify',
	function ($scope, $rootScope, $http, $location, $routeParams, $cookieStore, $timeout, slugify) {
		$rootScope.pageSlug = 'cart'
		$rootScope.pageTitle = 'Shopping cart';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$scope.cartLoading = true;
		
		$scope.cart = {};
		$scope.getCart = function (id) {
			$scope.cartLoading = true;
			$http.post('/carts/detail', { 'id': id }).success(function (cart) {
				$scope.cart = cart;
				$rootScope.pageSubtitle = cart.title;
				
				$scope.cartLoading = false;
				$scope.cart.books.forEach(function (item) {
					item.book['slug'] = slugify(item.book.title);
				});

				$rootScope.titleLine = $rootScope.pageSubtitle + $rootScope.titleSep1 + $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;
			});
		}
		$scope.getCart($routeParams.id);

		$scope.gotoDetail = function (index) {
			$cookieStore.put('detailSource', { 
				'page': 'cart', 
				'source': $scope.cart.title,
				'id': $scope.cart._id,
				'pos': index,
				'total': $scope.cart.books.length,
			});
		}

		var timer = false;
		$scope.updateCart = function () {
			if (timer) $timeout.cancel(timer);
			timer = $timeout(function () {
				$http.post('/carts/update', $scope.cart).success(function (response) {
					$scope.cart.quantity = response.quantity;
					$scope.cart.price = response.price;
					$scope.cart.editor = response.editor;
					$scope.cart.edited = response.edited;

					if (response._id == $rootScope.activeCart._id) {
						$rootScope.getActiveCart(response._id);
					}
				});
			}, 500);
		}
	}
]);