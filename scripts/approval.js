var ctrl = angular.module('approval', []);

ctrl.controller('approvalController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.pageSlug = 'approval'
		$rootScope.pageTitle = 'Approval plans';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;	
	}	
]);