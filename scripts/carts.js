var ctrl = angular.module('carts', []);

ctrl.controller('cartController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$cookieStore', '$timeout', 'slugify', 'focus',
	function ($scope, $rootScope, $http, $location, $routeParams, $cookieStore, $timeout, slugify, focus) {
		$rootScope.pageSlug = 'cart'
		$rootScope.pageTitle = 'Shopping cart';
		$rootScope.pageSubtitle = '';
		$rootScope.titleLine = $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;

		$scope.cartLoading = true;
		
		$scope.cart = {};
		$scope.getCart = function (id) {
			$scope.cartLoading = true;
			$http.post('/carts/detail', { 'id': id }).success(function (cart) {
				$scope.cart = cart;
				$scope.cartLoading = false;
				$scope.cart.books.forEach(function (item) {
					item.book['slug'] = slugify(item.book.title);
				});

				$rootScope.pageSubtitle = cart.title;
				$rootScope.titleLine = $rootScope.pageSubtitle + $rootScope.titleSep1 + $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;
			});
		}
		$scope.getCart($routeParams.id);

		$scope.gotoDetail = function (index) {
			$cookieStore.put('detailSource', { 
				'page': 'cart', 
				'source': $scope.cart.title,
				'id': $scope.cart._id,
				'pos': index,
				'total': $scope.cart.books.length,
			});
		}

		var timer = false;
		$scope.updateCart = function () {
			if (timer) $timeout.cancel(timer);
			timer = $timeout(function () {
				$http.post('/carts/update', $scope.cart).success(function (response) {
					$scope.cart.quantity = response.quantity;
					$scope.cart.price = response.price;
					$scope.cart.editor = response.editor;
					$scope.cart.edited = response.edited;

					if (response._id == $rootScope.activeCart._id) {
						$rootScope.getActiveCart(response._id);
					}
					$rootScope.getCarts();
				});
			}, 500);
		}

		$scope.removingBook = false;
		$scope.removeBook = function (result) {
			$scope.removingBook = result._id;
			$timeout(function () { 
				$scope.cart.books.splice($scope.cart.books.indexOf(result), 1);
				$scope.updateCart();
			}, 295);
		}

		$scope.activateCart = function () {
			$http.post('/users/cart', $scope.cart).success(function (response) {
				$rootScope.user.cart = response.id;
				$rootScope.getActiveCart(response.id);
			});
		}

		$scope.renameCart = function () {
			var title = prompt("Please enter new shopping cart name", $scope.cart.title);
			if (title != null) {
				$scope.cart.title = title;
				$scope.cart.slug = slugify(title);
				$scope.updateCart();

				$rootScope.pageSubtitle = title;
				$rootScope.titleLine = $rootScope.pageSubtitle + $rootScope.titleSep1 + $rootScope.pageTitle + $rootScope.titleSep2 + $rootScope.masthead;
			}
		}

		$scope.removeCart = function () {
			if (confirm('Are you sure you want to remove this cart?')) {
				$rootScope.cartList.splice($rootScope.cartList.indexOf($scope.cart), 1);
				if ($scope.cart._id == $rootScope.user.cart && $rootScope.cartList.length > 0) $scope.activateCart($rootScope.cartList[0]);
				$http.post('/carts/remove', { 'id': $scope.cart._id }).success(function (response) {
					$location.path('/')
				});
			}
		}

		$scope.editingRef = false;
		$scope.editRef = function (id, type) {
			$scope.editingRef = {
				ref: type,
				id: id
			}
			focus(type + '-' + id);
		}

		$scope.editingRefBlur = function () { $scope.editingRef = false; }

		$scope.editingRefKeypress = function ($event) { 
			if ($event.keyCode == 13) $scope.editingRef = false; 
		}

		$scope.activeAllRefs = false;
		$scope.activateAllRef = function (arg) {
			$scope.activeAllRefs = arg;
			focus('allref-' + arg);
		}

		$scope.allRefs;
		$scope.initAllRefs = function () {
			$scope.allRefs = {
				reference: '',
				department: '',
				budget: '',
				instructions: '',
			}	
		}
		$scope.initAllRefs();

		$scope.blurAllRefs = function () {
			$scope.activeAllRefs = false;
		}

		$scope.applyAllRefs = function () {
			for (i in $scope.cart.books) {
				if ($scope.allRefs.reference.length > 0) $scope.cart.books[i].reference = $scope.allRefs.reference;
				if ($scope.allRefs.department.length > 0) $scope.cart.books[i].department = $scope.allRefs.department;
				if ($scope.allRefs.budget.length > 0) $scope.cart.books[i].budget = $scope.allRefs.budget;
				if ($scope.allRefs.instructions.length > 0) $scope.cart.books[i].instructions = $scope.allRefs.instructions;
			}
			$scope.updateCart();
		}


	}
]);