angular.module('mapplication', ['ngRoute', 'MainController', 'MainServices'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'HomeController'
	})

	.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'LoginController'
	})
	.when('/register', {
		templateUrl: 'templates/register.html',
		controller: 'RegisterController'
	})
	.when('/account', {
		templateUrl: 'templates/account.html',
		controller: 'AccountController'
	})

	.otherwise({redirectTo:'/'});

    $locationProvider.html5Mode(true);
}])