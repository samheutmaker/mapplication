const angular = require('angular');
require('angular-animate');
require('angular-route');
require('leaflet');
require('angular-leaflet-directive')
require('mapbox');
require('./factory');


// Create App
const mapplication = angular.module('mapplication', ['Factory', 'ngAnimate', 'ngRoute', 'leaflet-directive'])

// Add Token Middleware
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
// Map Controller
mapplication.controller('HomeController', ['$scope', 'EE',
  function($scope, EE) {
    // Hide Map Initially
    $scope.showMap = false;
    // Get User location
    navigator.geolocation.getCurrentPosition(function(pos) {
      // Apply changes
      $scope.$apply(function() {
        // Pass location data to map instance
        $scope.callback = function(map) {
          map.setView([pos.coords.latitude, pos.coords.longitude], 15);
          // Show loaded Map
        }
           $scope.showMap = true;
          // Broadcast event
          EE.emit('MAP_LOADED');
      });
    }, function(err) {
      console.log(err)
    })
  }
])
//Auth Controller
.controller('AuthController', ['$scope', function($scope) {
	console.log('Auth');
}])
// Login Controller
.controller('LoginController', ['$scope', '$location', '$window',
 'EE', 'AuthFactory', '$rootScope',
  function($scope, $location, $window, EE, AuthFactory, $rootScope) {
    // Login function
    $scope.login = function(loginModel) {
      // Call login function from Auth Factory
      AuthFactory.login(loginModel).then(function(res) {
        // Check for token
        if (res.data.token) {
          // Save token
          $window.sessionStorage.token = res.data.token;
          // Broadcast event and user ID
          EE.emit('USER_AUTHENTICATED', res.data.user._id);
        } else {
          // Alert no user
          $rootScope.loginMessage = 'No User Found.'
        }
        // Check for error
      }, function(err) {
        $rootScope.loginMessage = err.data.msg;
      });
    };
  }
])
// Menu Controller
.controller('MenuController', ['$scope, EE', function($scope, EE) {
	$scope.showMenu = false;
	$scope.$on('USER_AUTHENTICATED', (id) => {

	})
}])
// Mapbox Directive
.directive('mapbox', [

  function() {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        callback: "="
      },
      template: '<div></div>',
      link: function(scope, element, attributes) {
        L.mapbox.accessToken = 'pk.eyJ1Ijoic2FtaGV1dG1ha2VyIiwiYSI6ImNpa25qcXV3eTBzcGJ2a2ttbnV6OXJtNzEifQ.8faX-FF4gPTe8WFrf24reg';
        var map = L.mapbox.map(element[0], 'mapbox.emerald');
        scope.callback(map);
      }
    };
  }
]);