	var app = angular.module('asterion', ['ngRoute', 'ngCookies', 'ngSanitize', 'highlighter']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partials/dashboard/main',
		controller: 'dashboardController'
	})
	.when('/q/:query', {
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

		$rootScope.slugify = function (text) {
			return text.toString()
			.replace(/\s+/g, '+') // Replace spaces with -
			.replace(/[^\w\+]+/g, '') // Remove all non-word chars
			.replace(/\+\++/g, '+') // Replace multiple - with single -
		} 

		$scope.quickSearch = function (searchTerm) {
			searchTerm = $rootScope.slugify(searchTerm);
			$location.path('/q/' + searchTerm);
		}	

		$scope.cartsDropdown = {
			active: false,
			loading: false,
			carts: [
				{ 
					title: 'Shipping cart title',
					amount: 12,
					price: 82.12
				},
				{ 
					title: 'Lost in the dream',
					amount: 31,
					price: 33.12
				},
				{ 
					title: 'Especially for you',
					amount: 2,
					price: 9.00
				},
				{ 
					title: 'Cart 3',
					amount: 7,
					price: 28.09
				},
				{ 
					title: 'Because you\'re too old, stupid moron',
					amount: 4,
					price: 849.12
				},
				{ 
					title: 'Kisses',
					amount: 3,
					price: 63.22
				},
				{ 
					title: 'Migraines',
					amount: 102,
					price: 993.21
				},
			]
		}

		$scope.focusCarts = function (item) {
			$scope.cartsDropdown['active'] = item._id;
		}

		$scope.blurCarts = function (item) {
			$scope.cartsDropdown['active'] = false;
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

app.controller('searchController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$cookieStore',
	function ($scope, $rootScope, $http, $location, $routeParams, $cookieStore) {
		$rootScope.pageSlug = 'search'
		$rootScope.pageTitle = 'Search';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$scope.focusSearch = function () {
			alert('YO!');
		};

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

		$scope.pagination = { 'page': 0, 'limit': 12, 'pages': 0 };

		var sortNo = $cookieStore.get('currentSortMethod') || 0;
		$scope.currentSortMethod = $scope.sortMethods[sortNo];
		$scope.sortOrder = $cookieStore.get('sortOrder') || 'asc';

	
		$scope.filterState = $cookieStore.get('filterState') || { 'status': 'open', 'group': 'close', 'country': 'close' };
		
		$scope.filter = { 
			'group': [],
			'status': [],
			'country': [],
			'order': []
		};

		$scope.filterDisplay = function (filter) {
			if ($scope.filterState[filter] == 'open') { 
				$scope.filterState[filter] = 'close'  
			} else { 
				$scope.filterState[filter] = 'open'
			}
			$cookieStore.put('filterState', $scope.filterState);
		}
		
		$scope.filterToggle = function (section, arg) {
			if (!arg) {
				$scope.filter[section].length = 0;
			} else {
				var i = $scope.filter[section].indexOf(arg);
				if (i < 0) {
					$scope.filter[section].push(arg);
				} else {
					$scope.filter[section].splice(i, 1);
				} 
			}

			$scope.searchLoading = true;
			$scope.getResults($scope.searchedFor);
		}

		$scope.getResults = function (searchTerm) {
			if (!searchTerm) {
				if (!$routeParams.query) return $location.path('/');
				searchTerm = $routeParams.query.replace(/\+/g, ' ');
				$rootScope.searchTerm = searchTerm;
			};
			
			$scope.noResultsFilter = false;
			$scope.noResults = false;

			$scope.searchedFor = searchTerm;
			$http.post('/search/results', { 
				'search': searchTerm, 
				'page': $scope.pagination.page, 
				'limit': $scope.pagination.limit,
				'sort': $scope.currentSortMethod.slug,
				'order': $scope.sortOrder,
				'filter': $scope.filter
			}).success(function (response) {
				$scope.searchLoading = false;
				
				if (response.hits.total < 1) $scope.noResultsFilter = true;
				if (response.hits.total < 1 && response.aggregations.availability.buckets.length < 1 && response.aggregations.binding.buckets.length < 1 && response.aggregations.countries.buckets.length < 1 ) {
					$scope.noResultsFilter = false;
					$scope.noResults = true;
					return false;
				}

				$scope.results = response.hits.hits;
				$scope.total = response.hits.total;
				$scope.aggs = response.aggregations;
				console.log(response.aggregations);

				$scope.pagination.pages = Math.ceil(response.hits.total / $scope.pagination.limit); 

				angular.forEach($scope.results, function (result) {
					result._source.price = parseFloat(result._source.price);
					result._source.price = result._source.price.toFixed(2);
				});

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
			$cookieStore.put('currentSortMethod', index);

			$scope.searchLoading = true;
 			$scope.getResults(searchTerm);
		};

		$scope.sortDirection = function (arg, searchTerm) {
			$scope.sortOrder = arg;
			$cookieStore.put('sortOrder', $scope.sortOrder);

			$scope.searchLoading = true;
 			$scope.getResults(searchTerm);
		};
	}
]);

angular.module('highlighter',[]).filter('highlight', function () {
	return function (text, search, caseSensitive) {
		if (!text) return false;

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