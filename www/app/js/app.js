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
  })
  .run(function($window, EE, $rootScope) {
    if ($window.sessionStorage.token && $window.sessionStorage._id) {
      $rootScope.authenticated = true;
    }
  });

// Map Controller
mapplication
//Auth Controller
.controller('AuthController', ['$scope', '$rootScope', 'EE', '$window', '$timeout',
  function($scope, $rootScope, EE, $window, $timeout) {
    if ($rootScope.authenticated) {
      $timeout(function() {
        EE.emit('USER_AUTHENTICATED', $window.sessionStorage._id);
      }, 100);

    } else {
      $scope.showAuthBox = true;
      $rootScope.authenticated = true;
    }

    $scope.$on('USER_AUTHENTICATED', () => {
      $scope.showAuthBox = false;
      console.log('adsf');
    })
  }
])
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
          // Save user ID
          $window.sessionStorage._id = res.data.user._id
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
//Register Controller
.controller('RegisterController', ['$scope', '$location', '$window',
  'EE', 'AuthFactory', '$rootScope',
  function($scope, $location, $window, EE, AuthFactory, $rootScope) {
    // Login function
    $scope.register = function(registerModel) {
      AuthFactory.register(registerModel).then(function(res) {
        if (res.data.token) {
          // Save token
          $window.sessionStorage.token = res.data.token;
          // Save user ID
          $window.sessionStorage._id = res.data.user._id
          // Broadcast event and user ID
          EE.emit('USER_AUTHENTICATED', res.data.user._id);
        } else {
          // Alert no user
          $rootScope.loginMessage = 'Email already registered.'
        }
        // Check for error
      }, function(err) {
        $rootScope.loginMessage = 'There was an error. Please try again.'
      })
    };
  }
])
// Menu Controller
.controller('ControlsController', ['$scope', 'EE', 'Pin',
  function($scope, EE, Pin) {

    // Hide Map Initially
    $scope.showMap = false;
    // Empty Map Object
    $scope.map = {};
    // Hide Controls
    $scope.showControls = false;
    //Empty User Object
    $scope.user = {};
    //Empty pin
    $scope.pinData = {};
    // Track Actions
    $scope.actions = {
      pinning: false,
      creating: false,
      loading: false
    };

    // User Authenticated
    $scope.$on('USER_AUTHENTICATED', (id) => {
      $scope.showControls = true;
      Pin.loadUserPins().then(function(res){
        res.data.forEach(function(pin, pinIndex) {
          L.mapbox.featureLayer({
            // this feature is in the GeoJSON format: see geojson.org
            // for the full specification
            type: 'Feature',
            geometry: {
              type: 'Point',
              // coordinates here are in longitude, latitude order because
              // x, y is the standard for GeoJSON and many formats
              coordinates: [pin.coords.lng,
                pin.coords.lat
              ]
            },
            properties: {
              title: pin.name,
              description: '1718 14th St NW, Washington, DC',
              // one can customize markers by adding simplestyle properties
              // https://www.mapbox.com/guides/an-open-platform/#simplestyle
              'marker-size': 'large',
              'marker-color': '#BE9A6B',
              'marker-symbol': 'cafe'
            }
          }).addTo($scope.map);
        })
      })

    });
    //Create New Pin 
    $scope.createNewPin = function(){
      Pin.createPin($scope.pinData).then(function(res) {
        console.log(res);
      })
    }

    // Map Clicked
    $scope.$on('MAP_CLICKED', (event, coords) => {
      if ($scope.actions.pinning) {
        $scope.$apply(function() {
          // Hide Pinning Message
          $scope.actions.pinning = false;
          // Add Pin To Map
          L.mapbox.featureLayer({
            // this feature is in the GeoJSON format: see geojson.org
            // for the full specification
            type: 'Feature',
            geometry: {
              type: 'Point',
              // coordinates here are in longitude, latitude order because
              // x, y is the standard for GeoJSON and many formats
              coordinates: [coords.lng,
                coords.lat
              ]
            },
            properties: {
              title: 'Peregrine Espresso',
              description: '1718 14th St NW, Washington, DC',
              // one can customize markers by adding simplestyle properties
              // https://www.mapbox.com/guides/an-open-platform/#simplestyle
              'marker-size': 'large',
              'marker-color': '#BE9A6B',
              'marker-symbol': 'cafe'
            }
          }).addTo($scope.map);
          //Display 'Creating New' Message
          $scope.actions.creating = true;
          // Add Coords to new pin
          $scope.pinData.coords = {
            lat: coords.lat, lng: coords.lng
          };
        });
      }
    });

    // Center Map On User and Initialize
    navigator.geolocation.getCurrentPosition(function(pos) {
      // Apply changes
      $scope.$apply(function() {
        // Pass location data to map instance
        $scope.callback = function(map) {
          $scope.map = map;
          $scope.map.setView([pos.coords.latitude, pos.coords.longitude], 15);
          // Show loaded Map
        }
        $scope.showMap = true;
        // Broadcast event
        EE.emit('MAP_LOADED');
      });
    }, function(err) {
      console.log(err)
    });

  }
])


// Mapbox Directive
.directive('mapbox', ['EE',

  function(EE) {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div></div>',
      link: function(scope, element, attributes) {
        L.mapbox.accessToken = 'pk.eyJ1Ijoic2FtaGV1dG1ha2VyIiwiYSI6ImNpa25qcXV3eTBzcGJ2a2ttbnV6OXJtNzEifQ.8faX-FF4gPTe8WFrf24reg';
        var map = L.mapbox.map(element[0], 'mapbox.emerald');
        map.on('click', function(e) {
          EE.emit('MAP_CLICKED', e.latlng);
        });
        scope.callback(map);
      }
    };
  }
]);