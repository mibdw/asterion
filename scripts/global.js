var app = angular.module('asterion', ['ngRoute', 'ngCookies'	]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/search/results'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

app.controller('global', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$rootScope.pageTitle = 'Search results';
		$rootScope.pageSubtitle = '';


		$scope.quickSearch = function () {
			alert($scope.searchTerm);
		}
	}
]);
