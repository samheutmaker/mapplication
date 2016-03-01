// Handles Pin CRUD
module.exports = function(app) {
  app.factory('Pin', ['$http',
    function($http) {
      return {
        loadUserPins: function() {
          return $http.get('/pins/all');
        },
        createPin: function(pinData) {
          return $http.post('/pins/new', pinData);
        },
        deletePin: function(pinId) {
          return $http.delete('/pins/' + pinId + '/delete');
        }
      }
    }
  ]);
}