// Handles search End Point
module.exports = function(app) {
  app.factory('Search', ['$http',
    function($http) {
      return {
        baseUrl: '/pins/search',
        query: function(query) {
          return $http.get(this.baseUrl + '/' + query);
        }
      }
    }
  ]);
}