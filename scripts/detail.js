var ctrl = angular.module('detail', []);

ctrl.controller('detailController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$cookieStore', 'searchify', 'slugify', 'orderByFilter', '$timeout', 'focus',
	function ($scope, $rootScope, $http, $location, $routeParams, $cookieStore, searchify, slugify, orderByFilter, $timeout, focus) {
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
			$cookieStore.put('detailSource', $scope.detailSource);
		}

		$scope.detailSource = $cookieStore.get('detailSource');
		
		if ($scope.detailSource.page == 'search') {

			var searchified = searchify($scope.detailSource.source);
			$scope.detailSource.url = 'search/' + searchified;
			$scope.detailSource.line = 'Search results: <em>' + $scope.detailSource.source + '</em>';
			$http.post('/search/results', { 
				'search': $scope.detailSource.source, 
				'page': $scope.detailSource.pos, 
				'limit': 3,
				'sort': $scope.detailSource.sort,
				'order': $scope.detailSource.order,
				'filter': $scope.detailSource.filter,
				'mark': 'detail'
			}).success(function (response) { 
				$scope.nextDetail = response.hits.hits[2];
				$scope.prevDetail = response.hits.hits[0];
				
				if ($scope.detailSource.pos == 0) $scope.nextDetail = response.hits.hits[1];

				if ($scope.nextDetail) $scope.nextDetail['slug'] = slugify($scope.nextDetail._source.title);
				if ($scope.prevDetail) $scope.prevDetail['slug'] = slugify($scope.prevDetail._source.title);
			});
		}

		if ($scope.detailSource.page == 'cart') {
			var slugified = searchify($scope.detailSource.source);
			$scope.detailSource.url = 'cart/' + slugified + '/' + $scope.detailSource.id;
			$scope.detailSource.line = 'Shopping cart: <em>' + $scope.detailSource.source + '</em>';	

			$scope.cartDetail = {};
			$http.post('/carts/detail', {'id': $scope.detailSource.id }).success(function (cart) {	
				$scope.cartDetail = cart;
				$scope.cartDetail.books = orderByFilter($scope.cartDetail.books, '-added');

				var next = $scope.detailSource.pos + 1;
				var prev = $scope.detailSource.pos - 1;

				$scope.nextDetail = $scope.cartDetail.books[next];
				$scope.prevDetail = $scope.cartDetail.books[prev];

				if ($scope.nextDetail) { 
					$scope.nextDetail['slug'] = slugify($scope.nextDetail.book.title);
					$scope.nextDetail._id = $scope.nextDetail.book._id
				}
				if ($scope.prevDetail) {
					$scope.prevDetail['slug'] = slugify($scope.prevDetail.book.title);
					$scope.prevDetail._id = $scope.prevDetail.book._id
				}
			});
		}

		var timer = false;
		$scope.updateCart = function () {
			if (timer) $timeout.cancel(timer);
			timer = $timeout(function () {
				$http.post('/carts/update', $scope.cartDetail).success(function (response) {
					if (response._id == $rootScope.activeCart._id) {
						$rootScope.getActiveCart(response._id);
					}
				});
			}, 500);
		}

		$scope.currentRef = false;
		$scope.setCurrentRef = function (arg) {
			$scope.currentRef = arg;
			focus('ref-' + arg);
		}

		$scope.blurCurrentRef = function () { $scope.currentRef = false }
		$scope.keypressCurrentRef = function ($event) { 
			if ($event.keyCode == 13) $scope.currentRef = false; 
		}

		if ($routeParams.id) $scope.getDetail($routeParams.id);
	}	
]);