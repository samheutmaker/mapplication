module.exports = function(app) {
  app.factory('SocketIO', ['$rootScope', '$window',
    function($rootScope, $window) {
      var socket = io.connect();
      return {
        // Subscribe to an event
        on: function(eventName, callback) {
          socket.on(eventName, function() {
            // Set args
            var args = arguments;
            // Force Dom Update
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          })
        },
        // Emit an event
        emit: function(eventName, data, callback) {
          if ($window.sessionStorage.token && data) {
            data.token = $window.sessionStorage.token;
          }
          socket.emit(eventName, data, function() {
            var args = arguments;
            $rootScope.$apply(function() {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          });
        }
      }
    }
  ]);
}