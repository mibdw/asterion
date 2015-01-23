var ctrl = angular.module('profile', []);

ctrl.controller('profileController', ['$scope', '$rootScope', '$http', '$timeout',
	function ($scope, $rootScope, $http, $timeout) {
		$rootScope.pageSlug = 'profile'
		$rootScope.pageTitle = 'Profile';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$scope.user = {};
		$scope.updated = false;

		$http.post('/users/read').success(function (user) {
			$scope.user = user;
		});

		$scope.updateUser = function (user) {
			$scope.updated = 'waiting';
			$http.post('/users/update', user).success(function (response) {
				$scope.updated = response.success;
				$timeout(function () { $scope.updated = false }, 3000);
			});
		}
	}	
]);