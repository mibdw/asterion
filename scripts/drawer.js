var ctrl = angular.module('drawer', []);

ctrl.controller('drawerController', ['$scope', '$http', '$location',
	function ($scope, $http, $location) {
		$scope.drawerMenu = [
			{'name': 'Contents', 'slug': 'contents', 'url': '/partials/drawer/contents'},
			{'name': 'Shopping carts', 'slug': 'carts', 'url': '/partials/drawer/carts'},
		];

		$scope.drawerActive = $scope.drawerMenu[0];
		$scope.gotoDrawer = function (option) {
			$scope.drawerActive = option;
		}
	}
]);