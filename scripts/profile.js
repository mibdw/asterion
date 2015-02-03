var ctrl = angular.module('profile', []);

ctrl.controller('profileController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.pageSlug = 'profile'
		$rootScope.pageTitle = 'Profile';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$scope.subMenu = [
			{ 'name': 'Information', 'slug': 'overview', 'url': '/partials/profile/overview' },
			{ 'name': 'Accounts', 'slug': 'accounts', 'url': '/partials/profile/accounts' },
			{ 'name': 'Activity', 'slug': 'activity', 'url': '/partials/profile/activity' },
		];

		$scope.currentPage = $scope.subMenu[0];
		$scope.gotoPage = function (option) {
			$scope.currentPage = option;
		}
	}	
]);

ctrl.controller('profileOverview', ['$scope', '$rootScope', '$http', '$timeout',
	function ($scope, $rootScope, $http, $timeout) {
		$rootScope.pageSubtitle = 'Information';
		$rootScope.titleLine = $rootScope.pageSubtitle + $rootScope.titleSep1 + $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$scope.updated = false;
		$scope.noMatch = false;

		$scope.confirmPassword = function () {
			$timeout(function () { 
				if ($scope.confirm && $rootScope.user.password != $scope.confirm) {
					$scope.noMatch = true;					
				} else {
					$scope.noMatch = false;
				}
			}, 1);
		}

		$scope.updateUser = function (user) {
			if ($rootScope.user.password && $rootScope.user.password != $scope.confirm) return alert('Password do not match');	

			$scope.updated = 'waiting';
			$http.post('/users/update', user).success(function (response) {
				$scope.updated = response.success;
				$rootScope.user.password = ''; 
				$scope.confirm = ''; 
				$timeout(function () { 
					$scope.updated = false;
				}, 3000);
			});
		}
	}
]);

ctrl.controller('profileActivity', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$rootScope.pageSubtitle = 'Activity';
		$rootScope.titleLine = $rootScope.pageSubtitle + $rootScope.titleSep1 + $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;


	}
]);