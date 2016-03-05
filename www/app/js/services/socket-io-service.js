module.exports = function(app) {
	app.factory('SocketIO', ['$rootScope', 
		function($rootScope) {
			var socket = io.connect();
			return {
				// Subscribe to an event
				on: function(eventName, callback) {
					console.log(socket);
					socket.on(eventName, function(){
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
					socket.emit(eventName, data, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							if(callback) {
								callback.apply(socket, args);
							}
						});
					});
				}
			}
	}]);
}