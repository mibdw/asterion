var ctrl = angular.module('drawer', []);

ctrl.controller('drawerController', ['$scope', '$http', '$location',
	function ($scope, $http, $location) {
		$scope.drawerMenu = [
			{'name': 'Contents', 'slug': 'contents', 'url': '/partials/drawer/contents'},
			{'name': 'Shopping carts', 'slug': 'carts', 'url': '/partials/drawer/carts'},
		];

		$scope.drawerPin = false;

		$scope.drawerActive = $scope.drawerMenu[0];
		$scope.gotoDrawer = function (option) {
			$scope.drawerActive = option;
		}
	}
]);

ctrl.controller('drawerCarts', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$scope.cartsSearch = false;
		$scope.cartsNew = false;

		$scope.createCart = function () {
			$http.post('/carts/create', { 'title': $scope.cartsName }).success(function (response) {

				$scope.cartsName = '';
				$scope.cartsNew = false;
				$rootScope.getCarts();
			});
		}

		$scope.removeCart = function (cart) {
			if (confirm('Are you sure you want to remove this cart?')) {
				$http.post('/carts/remove', { 'id': cart._id }).success(function (response) {
					$rootScope.getCarts();
				})
			}
		}
	}
]);

ctrl.controller('drawerContents', ['$scope', '$http',
	function ($scope, $http) {

		
	}
]);