var ctrl = angular.module('drawer', []);

ctrl.controller('drawerController', ['$scope', '$http', '$rootScope','$location', 'focus', 'slugify',
	function ($scope, $http, $rootScope, $location, focus, slugify) {
		$scope.drawerMenu = [
			{'name': 'Contents', 'slug': 'contents', 'url': '/partials/drawer/contents'},
			{'name': 'Shopping carts', 'slug': 'carts', 'url': '/partials/drawer/carts'},
		];
	
		$rootScope.drawerPin = false;
		$scope.drawerToggle = function (pin) {
			pin ? $rootScope.drawerPin = false : $rootScope.drawerPin = true;
			if ($rootScope.cartList.length < 1) focus('cart-name-empty');
		}

		$scope.drawerKeypress = function ($event, pin) {
			if ($event.keyCode == 13) $scope.drawerToggle(pin);
		}

		$scope.drawerActive = $scope.drawerMenu[0];
		$scope.gotoDrawer = function (option) {
			$scope.drawerActive = option;
		}

		$scope.createCartEmpty = function () {
			$http.post('/carts/create', { 
				'title': $scope.cartNameEmpty,
				'slug': slugify($scope.cartNameEmpty),
			}).success(function (response) {
				$scope.cartsName = '';
				$scope.cartsNew = false;
				$rootScope.getCarts();

				$http.post('/users/cart', response).success(function (what) {
					$rootScope.user.cart = what.id;
					$rootScope.getActiveCart(what.id);
				});
			});
		}
	}
]);

ctrl.controller('drawerCarts', ['$scope', '$rootScope', '$http', 'focus', 'slugify', '$location',
	function ($scope, $rootScope, $http, focus, slugify, $location) {
		$scope.cartsSearch = false;
		$scope.cartsSearchToggle = function (arg) {
			arg ? $scope.cartsSearch = false : $scope.cartsSearch = true;
			if (arg == false) focus('carts-query');
			if (arg == true) $scope.cartsQuery = '';
		}

		$scope.cartsNew = false;
		$scope.cartsNewToggle = function (arg) {
			arg ? $scope.cartsNew = false : $scope.cartsNew = true;
			if (arg == false) focus('carts-name');
			if (arg == true) $scope.cartsName = '';
		}

		$scope.createCart = function () {
			$http.post('/carts/create', { 
				'title': $scope.cartsName,
				'slug': slugify($scope.cartsName),
			}).success(function (response) {
				$scope.cartsName = '';
				$scope.cartsNew = false;
				$rootScope.getCarts();
			});
		}

		$scope.activateCart = function (cart) {
			$http.post('/users/cart', cart).success(function (response) {
				$rootScope.user.cart = response.id;
				$rootScope.getActiveCart(response.id);
			});
		}

		$scope.removeCart = function (cart) {
			if (confirm('Are you sure you want to remove this cart?')) {
				$rootScope.cartList.splice($rootScope.cartList.indexOf(cart), 1);
				if (cart._id == $rootScope.user.cart && $rootScope.cartList.length > 0) $scope.activateCart($rootScope.cartList[0]);
				$http.post('/carts/remove', { 'id': cart._id });
			}
		}

		$scope.renameCart = function (cart) {
			var i = $rootScope.cartList.indexOf(cart);
			var title = prompt("Please enter new shopping cart name", $rootScope.cartList[i].title);
			if (title != null) {
				$rootScope.cartList[i].title = title;
				$rootScope.cartList[i].slug = slugify(title);
				$http.post('/carts/rename', $rootScope.cartList[i]).success(function (response) {
					$rootScope.getCarts();
				});
			}
		}
	}
]);

ctrl.controller('drawerContents', ['$scope', '$rootScope', '$http', '$cookieStore', '$timeout', 'slugify', '$routeParams',
	function ($scope, $rootScope, $http, $cookieStore, $timeout, slugify, $routeParams) {

		$scope.removeCart = function () {
			if (confirm('Are you sure you want to remove this cart?')) {
				$rootScope.cartList.splice($rootScope.cartList.indexOf(cart), 1);
				if ($rootScope.activeCart._id == $rootScope.user.cart && $rootScope.cartList.length > 0) $rootScope.activateCart($rootScope.cartList[0]);
				$http.post('/carts/remove', { 'id': $rootScope.activeCart._id });
				$rootScope.getCarts();
			}
		}	

		$scope.removingBook = false;
		$scope.removeBook = function (result) {
			$scope.removingBook = result._id;
			$timeout(function () { 
				$rootScope.activeCart.books.splice($rootScope.activeCart.books.indexOf(result), 1);
				$scope.updateCart();
			}, 295);
		}	

		$scope.renameCart = function () {
			var title = prompt("Please enter new shopping cart name", $rootScope.activeCart.title);
			if (title != null) {
				$rootScope.activeCart.title = title;
				$rootScope.activeCart.slug = slugify(title);
				$http.post('/carts/rename', $rootScope.activeCart).success(function (response) {
					$rootScope.activeCart.quantity = response.quantity;
					$rootScope.activeCart.price = response.price;
					$rootScope.activeCart.editor = response.editor;
					$rootScope.activeCart.edited = response.edited;
					$rootScope.getCarts();
				});
			}
		}
		
		var timer = false;
		$scope.updateCart = function () {
			if (timer) $timeout.cancel(timer);
			timer = $timeout(function () {
				$http.post('/carts/update', $rootScope.activeCart).success(function (response) {
					$rootScope.activeCart.quantity = response.quantity;
					$rootScope.activeCart.price = response.price;
					$rootScope.activeCart.editor = response.editor;
					$rootScope.activeCart.edited = response.edited;
					$rootScope.getCarts();
				});
			}, 500);
		}

		$scope.gotoDetail = function (index) {
			$cookieStore.put('detailSource', { 
				'page': 'cart', 
				'source': $rootScope.activeCart.title,
				'id': $rootScope.activeCart._id,
				'pos': index,
				'total': $rootScope.activeCart.books.length,
			});
		}
	}
]);