const angular = require('angular');
require('angular-animate');
require('angular-route');
require('leaflet');
require('angular-leaflet-directive')
require('mapbox');
require('./factory');
var _ = require('./helpers');
// Create App
const mapplication = angular.module('mapplication', ['Factory', 'ngAnimate',
    'ngRoute', 'leaflet-directive'
  ])
  // Add Token Middleware
  .config(function($httpProvider) {
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
          $rootScope.loginMessage =
            'There was an error. Please try again.'
        })
      };
    }
  ])
  // Menu Controller
  .controller('ControlsController', ['$scope', 'EE', 'Pin', '$rootScope',
    function($scope, EE, Pin, $rootScope) {

      // Hide Map Initially
      $scope.showMap = false;
      // All Pin Data
      $scope.allPins = [];
      // Empty Map Object
      $scope.map = null;
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
        if ($scope.map) {
          $scope.getAndMapMarkers();
        }
      });

      // Get all users marker and place on map
      $scope.getAndMapMarkers = function() {
        Pin.loadUserPins().then(function(res) {
          $scope.allPins = res.data;
          EE.emit('MARKERS_CHANGED', $scope.allPins);
        });
      };

      // Delete Pin
      $scope.deletePin = function(index) {
        var pin = $scope.allPins.splice(index, 1);
        EE.emit('MARKERS_CHANGED', $scope.allPins);
        Pin.deletePin(pin[0]._id).then(function(res) {});
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
          EE.emit('MARKERS_CHANGED', $scope.allPins);

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
                15);
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


// Mapbox Directive
.directive('mapbox', ['EE',

  function(EE) {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div></div>',
      link: function(scope, element, attributes) {
        L.mapbox.accessToken =
          'pk.eyJ1Ijoic2FtaGV1dG1ha2VyIiwiYSI6ImNpa25qcXV3eTBzcGJ2a2ttbnV6OXJtNzEifQ.8faX-FF4gPTe8WFrf24reg';
        // All Markers on map
        var markers = [];
        // Marker being created
        var tempMarker = {};
        var map = L.mapbox.map(element[0], 'mapbox.emerald');

        // Map Click Event
        map.on('click', function(e) {
          var coords = e.latlng;
          if (scope.actions.pinning) {
            scope.$apply(function() {
              // Hide Pinning Message
              scope.actions.pinning = false;
              // Add Pin To Map
              var newMarker = L.marker([coords.lat, coords.lng], {
                icon: L.mapbox.marker.icon({
                  'marker-size': 'large',
                  'marker-symbol': 'bus',
                  'marker-color': '#fa0'
                })
              }).addTo(map);
              tempMarker = newMarker;
              //Display 'Creating New' Message
              scope.actions.creating = true;
              // Add Coords to new pin
              scope.pinData.coords = {
                lat: coords.lat,
                lng: coords.lng
              };
            });
          }
        });

        // Diff markers and update
        scope.updateMap = function(arrToMap) {
          //Dif Map
          var markerdifInfo = _.modified(markers, arrToMap);
          // Markers to add
          var toAdd = markerdifInfo.add;
          // Markers to remove
          var toRemove = markerdifInfo.remove;
          // Remove unwanted markers
          toRemove.forEach(function(markerToRemove, markerIndex) {
            map.removeLayer(markerToRemove.newMarker);
          });
          // Add new markers
          toAdd.forEach(function(pin, pinIndex) {
            scope.addSingleMarker(pin);
          });
        };
        // Add single marker to map
        scope.addSingleMarker = function(pin) {
          pin.newMarker = L.marker([pin.coords.lat, pin.coords.lng], {
            icon: L.mapbox.marker.icon({
              'marker-size': 'large',
              'marker-symbol': 'bus',
              'marker-color': '#fa0'
            })
          }).addTo(map);
          // Save pin in current markers
          markers.push(pin);
        };
        // Update Map Markers
        scope.$on('MARKERS_CHANGED', function(event, newMarkers) {
          scope.updateMap(newMarkers);
        });
        // Clear Temp Marker
        scope.$on('REMOVE_TEMP_MARKER', function() {
          map.removeLayer(tempMarker)
          tempMarker = {};
        });
        // Intialize map in parent scope
        scope.callback(map);
      }
    };
  }
]);
