// Attaches token to evey request
module.exports = function(app) {
  app.factory('authInterceptor', ['$rootScope', '$q', '$window',
    function($rootScope, $q, $window) {
      return {
        request: function(req) {
          req.headers = req.headers || {};
          if ($window.sessionStorage.token) {
            // retrieve token from session storage if it exists; store in config object
            req.headers.token = $window.sessionStorage.token;
          }
          return req;
        },
        response: function(response) {
          if (response.status === 401) {
            // handle the case where the user is not authenticated
          }
          return response || $q.when(response);
        }
      };
    }
  ]);
}