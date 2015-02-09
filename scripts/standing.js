var ctrl = angular.module('standing', []);

ctrl.controller('standingController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.pageSlug = 'standing'
		$rootScope.pageTitle = 'Standing orders and journals';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;	
	}	
]);