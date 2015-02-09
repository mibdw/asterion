var ctrl = angular.module('tracing', []);

ctrl.controller('tracingController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.pageSlug = 'tracing'
		$rootScope.pageTitle = 'Order tracing';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;	
	}	
]);