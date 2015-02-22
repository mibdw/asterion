var ctrl = angular.module('detail', []);

ctrl.controller('detailController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$cookieStore', 'searchify', 'slugify',
	function ($scope, $rootScope, $http, $location, $routeParams, $cookieStore, searchify, slugify) {
		$rootScope.pageSlug = 'detail'
		$rootScope.pageTitle = 'Detail';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$('.container').scrollTop(0);

		$scope.detail = {};
		$scope.detailLoading = true;
		$scope.getDetail = function (id) {
			$http.post('/detail/id', { 'id': id }).success(function (detail) {
				$scope.detail = detail;
				$rootScope.titleLine = $scope.detail.title + $rootScope.titleSep1 + $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;
				$scope.detailLoading = false;
			});
		}

		$scope.gotoDetail = function (arg) {
			if (arg == 'prev') $scope.detailSource.pos = $scope.detailSource.pos - 1;
			if (arg == 'next') $scope.detailSource.pos = $scope.detailSource.pos + 1;
			console.log($scope.detailSource);
			$cookieStore.put('detailSource', $scope.detailSource);
		}

		$scope.detailSource = $cookieStore.get('detailSource');

		if ($scope.detailSource.page = 'search') {
			var searchified = searchify($scope.detailSource.source);
			$scope.detailSource.url = 'search/' + searchified;
			$scope.detailSource.line = 'Search results for <em>' + $scope.detailSource.source + '</em>';
			$http.post('/search/results', { 
				'search': $scope.detailSource.source, 
				'page': $scope.detailSource.pos, 
				'limit': 3,
				'sort': $scope.detailSource.sort,
				'order': $scope.detailSource.order,
				'filter': $scope.detailSource.filter,
				'mark': 'detail'
			}).success(function (response) { 
				console.log(response);
				$scope.nextDetail = response.hits.hits[2];
				$scope.prevDetail = response.hits.hits[0];
				
				if ($scope.detailSource.pos == 0) $scope.nextDetail = response.hits.hits[1];

				if ($scope.nextDetail) $scope.nextDetail['slug'] = slugify($scope.nextDetail._source.title);
				if ($scope.prevDetail) $scope.prevDetail['slug'] = slugify($scope.prevDetail._source.title);
			});
		}

		if ($routeParams.id) $scope.getDetail($routeParams.id);
	}	
]);