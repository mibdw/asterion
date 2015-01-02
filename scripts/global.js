var app = angular.module('asterion', ['ngRoute', 'ngCookies', 'ngSanitize', 'highlighter']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/dashboard/main',
		controller: 'dashboardController'
	})
	.when('/search', {
		templateUrl: 'partials/search/results',
		controller: 'searchController'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

app.controller('global', ['$scope', '$rootScope', '$http', '$location', '$route',
	function ($scope, $rootScope, $http, $location, $route) {
		$rootScope.masthead = 'Asterion';
		$rootScope.titleSep1 = ' \u2014 ';
		$rootScope.titleSep2 = ' \u00BB ';
		$rootScope.titleLine = 'Bookselling like a pro' + $rootScope.titleSep1 + $rootScope.masthead;

		$rootScope.searchTerm;

		$scope.quickSearch = function (searchTerm) {
			if ($location.path() == '/search') $route.reload();

			$location.path('/search');
		}
	}
]);

app.controller('dashboardController', ['$scope', '$rootScope', '$http', '$location',
	function ($scope, $rootScope, $http, $location) {
		$rootScope.pageSlug = 'dashboard'
		$rootScope.pageTitle = 'Dashboard';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;
	}	
]);

app.controller('searchController', ['$scope', '$rootScope', '$http', '$location', '$cookies',
	function ($scope, $rootScope, $http, $location, $cookies) {
		$rootScope.pageSlug = 'search'
		$rootScope.pageTitle = 'Search';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$scope.searchLoading = true;
		$scope.noResults = false;
		$scope.searchedFor = '';

		$scope.sortMethods = [
			{ 'slug': 'relevance', 'name': 'Relevance' }, 
			{ 'slug': 'title', 'name': 'Title' }, 
			{ 'slug': 'author', 'name': 'Author' }, 
			{ 'slug': 'publisher', 'name': 'Publisher' }, 
			{ 'slug': 'isbn', 'name': 'ISBN' }, 
		];

		$scope.pagination = {
			'page': 0,
			'limit': 12,
			'pages': 0,
		};

		$scope.currentSortMethod = $scope.sortMethods[0];
		if ($cookies.currentSortMethod) $scope.currentSortMethod = $scope.sortMethods[$cookies.currentSortMethod];

		$scope.sortOrder = 'asc';
		if ($cookies.sortOrder) $scope.sortOrder = $cookies.sortOrder;

		$scope.getResults = function (searchTerm) {
			if (!searchTerm) return $location.path('/');
			$scope.noResults = false;
			$scope.searchedFor = searchTerm;

			$http.post('/search/results', { 
				'search': searchTerm, 
				'page': $scope.pagination.page, 
				'limit': $scope.pagination.limit,
				'sort': $scope.currentSortMethod.slug,
				'order': $scope.sortOrder
			}).success(function (results) {
				$scope.searchLoading = false;
				if (results.hits.total < 1) $scope.noResults = true;

				$scope.searchResults = results;
				$scope.pagination.pages = Math.ceil(results.hits.total / $scope.pagination.limit); 

				$rootScope.titleLine = 'Search results for \"' + searchTerm + '\"' + $rootScope.titleSep1 + $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;
			});
		};

		$scope.searchPage = function (arg, searchTerm) {
			$scope.searchLoading = true;
			if (arg == 'next') $scope.pagination.page = $scope.pagination.page + 1;
			if (arg == 'prev') $scope.pagination.page = $scope.pagination.page - 1;
			if (arg == 'first') $scope.pagination.page = 0;
			if (arg == 'last') $scope.pagination.page = $scope.pagination.pages - 1;
 			$scope.getResults(searchTerm);
		};

		$scope.sortResults = function (index, searchTerm) {
			$scope.currentSortMethod = $scope.sortMethods[index];
			$cookies.currentSortMethod = index;

			$scope.searchLoading = true;
 			$scope.getResults(searchTerm);
		};

		$scope.sortDirection = function (arg, searchTerm) {
			$scope.sortOrder = arg;
			$cookies.sortOrder = $scope.sortOrder;

			$scope.searchLoading = true;
 			$scope.getResults(searchTerm);
		};
	}
]);

angular.module('highlighter',[]).filter('highlight', function () {
	return function (text, search, caseSensitive) {
		text = text.toString();
		search = search.toString();
		search = search.split(' ');

		for (i in search) {
			if (text && (search[i] || angular.isNumber(search[i]))) {
				if (caseSensitive) {
					text = text.split(search[i]).join('<mark>' + search[i] + '</mark>');
				} else {
					text = text.replace(new RegExp(search[i], 'gi'), '<mark>$&</mark>');
				}
			} else {
				text = text;
			}

			if (i ==  search.length - 1) return text;
		}
	};
});