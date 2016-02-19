// For emitting events
angular.module('Factory', [])
  .factory('EE', function($rootScope) {
    return {
      emit: function(event, data) {
        $rootScope.$broadcast(event, data);
      }
    }
  })
  // Handles Pin Requests
  .factory('Pin', function($http) {
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
  })
  // Handles searching
  .factory('Search', function($http) {
    return {
      baseUrl: '/pins/search',
      query: function(query) {
        return $http.get(this.baseUrl + '/' + query);
      }
    }
  })
  // Handles Auth
  .factory('AuthFactory', function($http) {
    return {
      login: function(data) {

        var headerData = data.email + ':' + data.password;
        var headerData = btoa(headerData);

        return $http({
          method: 'GET',
          url: '/auth/login',
          headers: {
            authorization: 'Basic ' + headerData
          }
        });
      },
      register: function(data) {
        var toSend = {
          authentication: {
            email: data.email,
            password: data.password
          }
        };

        return $http({
          method: 'POST',
          url: 'auth/register',
          data: toSend
        });
      }
    }
  })
  // Attaches token to evey request
  .factory('authInterceptor', function($rootScope, $q, $window) {
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
  })
