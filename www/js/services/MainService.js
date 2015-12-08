angular.module('MainServices', [])


.service('Events', ['$http', function($http){
    this.get = function(){
        return $http.get('/api/events');
    }
    this.getUserEvents = function(user_obj) {
        return $http.post('/api/events/user', user_obj);
    }

}])

.service('User', ['$http', function($http){
    this.login = function(data){
        return $http.post('/login', data);
    }
    this.register = function(data){
    	return $http.post('/register', data);
    }

}]);
