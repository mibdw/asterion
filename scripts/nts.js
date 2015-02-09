var ctrl = angular.module('nts', []);

ctrl.controller('ntsController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.pageSlug = 'nts'
		$rootScope.pageTitle = 'New title service';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;	
	}	
]);