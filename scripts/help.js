var ctrl = angular.module('help', []);

ctrl.controller('helpController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.pageSlug = 'help'
		$rootScope.pageTitle = 'Help';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;	
	}	
]);