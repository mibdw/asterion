var ctrl = angular.module('dashboard', []);

ctrl.controller('dashboardController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.pageSlug = 'dashboard'
		$rootScope.pageTitle = 'Dashboard';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;	
	}	
]);