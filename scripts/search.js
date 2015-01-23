var ctrl = angular.module('search', []);

ctrl.controller('searchController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$cookieStore',
	function ($scope, $rootScope, $http, $location, $routeParams, $cookieStore) {
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
				
				if (response.hits.total < 1) $scope.noResults = true;

				$scope.results = response.hits.hits;
				$scope.total = response.hits.total;
				$scope.aggs = response.aggregations;

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