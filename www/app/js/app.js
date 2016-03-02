const angular = require('angular');


// Create App
const mapplication = angular.module('mapplication', []);
// Require Modules
const _ = require('staff');
require('leaflet');
require('mapbox');
require('./map')(mapplication);
require('./services')(mapplication);
require('./directives')(mapplication);



// Add Token Middleware
mapplication.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})
  .run(function($window, EE, $rootScope) {
    if ($window.sessionStorage.token && $window.sessionStorage._id) {
      $rootScope.authenticated = true;
    }
  });

// Define application controllers
mapplication
//Auth Controller
.controller('AuthController', ['$scope', '$rootScope', 'EE', '$window',
  '$timeout',
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
        $rootScope.loginMessage =
          'There was an error. Please try again.'
      })
    };
  }
])
// Menu Controller
.controller('ControlsController', ['$scope', 'EE', 'Pin', '$rootScope',
  'Search', 'Comment', '$timeout', '$interval',
  function($scope, EE, Pin, $rootScope, Search, Comment, $timeout, $interval) {

    // Hide Map Initially
    $scope.showMap = false;
    // All User Data
    $scope.allPins = [];
    // All search pins
    $scope.searchPins = [];
    // Currently active pin
    $scope.activePin = {};
    // Empty Map Object
    $scope.map = null;
    // Hide Controls
    $scope.showControls = false;
    //Empty User Object
    $scope.user = {};
    // Search Term
    $scope.search = null;
    //Empty pin
    $scope.pinData = {};
    // Track Actions
    $scope.actions = {
      pinning: false,
      creating: false,
      detail: false,
      loading: false,
      searching: false,
      showComments: false
    };

    $scope.stopPinning = function(removeMarker){
      $scope.actions.creating = false;
      $scope.actions.pinning = false;
      if(removeMarker) {
        EE.emit('REMOVE_TEMP_MARKER');  
      }
    };

    $scope.hideDetail = function(){
      $scope.detail = false;
    };


    // Search function
    $scope.searchFor = function() {
      $scope.stopPinning(true);
      $scope.hideDetail();
      if ($scope.search.length > 1) {
        Search.query($scope.search).then(function(res) {
          res.data = (res.data.length) ? res.data : [];
          $scope.allPins = res.data;
          EE.emit('MARKERS_CHANGED', {
            newMarkers: res.data,
            shouldDif: false
          });
        });
      } else {
        $scope.getAndMapMarkers();
      }

    };

    // User Authenticated EE
    $scope.$on('USER_AUTHENTICATED', (event, id) => {
      $scope.user._id = id;
      $scope.showControls = true;
      if ($scope.map) {
        $scope.getAndMapMarkers();
      }
    });

    // Marker Clicked EE
    $scope.$on('MARKER_CLICKED', function(event, id) {
      console.log(id);
      $scope.showDetail(id);
    });


    // Show marker detail by id
    $scope.showDetail = function(pinId) {
      console.log(pinId);
      $scope.activePin = {};
      $scope.activePin = $scope.allPins.filter(function(pin) {
        return pin._id === pinId; // Filter out the appropriate one
      })[0];
      // UI
      $scope.actions.detail = true;
      $scope.stopPinning(false);
    };


    // Get all users marker and place on map
    $scope.getAndMapMarkers = function() {
      // UI
      $scope.stopPinning(true);
      $scope.hideDetail();
      // Load Pins
      Pin.loadUserPins().then(function(res) {
        $scope.allPins = res.data;
        EE.emit('MARKERS_CHANGED', {
          newMarkers: $scope.allPins,
          shouldDif: true
        });
      });
    };

    // Delete Pin
    $scope.deletePin = function(pin) {
      $scope.allPins.splice($scope.allPins.indexOf(pin), 1);
      EE.emit('MARKERS_CHANGED', {
        newMarkers: $scope.allPins,
        shouldDif: true
      });
      Pin.deletePin(pin._id).then(function(res) {});
    };

    //Create New Pin
    $scope.createNewPin = function() {
      // Hide Creat New Form
      $scope.actions.creating = false;
      // Post data to server
      Pin.createPin($scope.pinData).then(function(res) {
        // Clear new pin
        $scope.pinData = {};
        // Add to pins
        $scope.allPins.push(res.data);
        // Emit Event
        EE.emit('REMOVE_TEMP_MARKER');
        EE.emit('MARKERS_CHANGED', {
          newMarkers: $scope.allPins,
          shouldDif: true
        });

      });
    };

    // Center Map On User and Initialize
    navigator.geolocation.getCurrentPosition(function(pos) {
      // Apply changes
      $scope.$apply(function() {
        // Pass location data to map instance
        $scope.callback = function(map) {
          // Store map instance
          $scope.map = map;
          // Set map Center
          $scope.map.setView([pos.coords.latitude, pos.coords.longitude],
            13);
          // Create User Marker
          var newMarker = L.marker([pos.coords.latitude, pos.coords.longitude], {
            icon: L.mapbox.marker.icon({
              'marker-size': 'large',
              'marker-color': '#2ecc71'
            })
          }).addTo($scope.map);

        }
        // Show Map
        $scope.showMap = true;
        // Load All Markers, if user is logged in
        if ($rootScope.authenticated) {
          $scope.getAndMapMarkers();
        }
        // Broadcast event
        EE.emit('MAP_LOADED');
      });
    }, function(err) {
      console.log(err)
    });

  }
])