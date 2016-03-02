// Event Emitter
module.exports = function(app) {
  app.factory('EE', ['$rootScope',
    function($rootScope) {
      return {
        emit: function(event, data) {
          $rootScope.$broadcast(event, data);
        }
      }
    }
  ]);
}