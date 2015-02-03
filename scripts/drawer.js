var ctrl = angular.module('drawer', []);

ctrl.controller('drawerController', ['$scope', '$http', '$rootScope','$location',
	function ($scope, $http, $rootScope, $location) {
		$scope.drawerMenu = [
			{'name': 'Contents', 'slug': 'contents', 'url': '/partials/drawer/contents'},
			{'name': 'Shopping carts', 'slug': 'carts', 'url': '/partials/drawer/carts'},
		];

		$rootScope.drawerPin = false;

		$scope.drawerActive = $scope.drawerMenu[0];
		$scope.gotoDrawer = function (option) {
			$scope.drawerActive = option;
		}

		$scope.createCartEmpty = function () {
			$http.post('/carts/create', { 
				'title': $scope.cartNameEmpty,
				'slug': $rootScope.slugify($scope.cartNameEmpty),
			}).success(function (response) {
				$scope.cartsName = '';
				$scope.cartsNew = false;
				$rootScope.getCarts();

				$http.post('/users/cart', response).success(function (what) {
					$rootScope.user.cart = what.id;
					$rootScope.getActiveCart(what.id);
				});
			});
		}
	}
]);

ctrl.controller('drawerCarts', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$scope.cartsSearch = false;
		$scope.cartsNew = false;

		$scope.createCart = function () {
			$http.post('/carts/create', { 
				'title': $scope.cartsName,
				'slug': $rootScope.slugify($scope.cartsName),
			}).success(function (response) {
				$scope.cartsName = '';
				$scope.cartsNew = false;
				$rootScope.getCarts();
			});
		}

		$scope.activateCart = function (cart) {
			$http.post('/users/cart', cart).success(function (response) {
				$rootScope.user.cart = response.id;
				$rootScope.getActiveCart(response.id);
			});
		}

		$scope.removeCart = function (cart) {
			if (confirm('Are you sure you want to remove this cart?')) {
				$rootScope.cartList.splice($rootScope.cartList.indexOf(cart), 1);
				if (cart._id == $rootScope.user.cart && $rootScope.cartList.length > 0) $scope.activateCart($rootScope.cartList[0]);
				$http.post('/carts/remove', { 'id': cart._id });
			}
		}
	}
]);

ctrl.controller('drawerContents', ['$scope', '$http',
	function ($scope, $http) {

		
	}
]);