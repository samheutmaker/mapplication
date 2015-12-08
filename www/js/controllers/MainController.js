angular.module('MainController', [])


	.controller('HomeController', function($scope) {

		console.log("Hello");

	})
.controller('LoginController', function($scope, User) {


    $scope.loginInfo = {};

    $scope.login = function(){

         User.login($scope.loginInfo).then(function(response) {

            if(response !== "0"){
               console.log(response);
              

            } else {
             	console.log(response);
            }
                
                
    
        }, function(response) {
          
            console.log(response);
  });


    }


})


.controller('RegisterController', function($scope, User) {

    $scope.registerInfo = {};

    $scope.register = function(){
    	console.log("called");
        if($scope.registerInfo.password === $scope.registerInfo.passwordCheck) {
            User.register($scope.registerInfo).then(
                    function(response) {
                        if(response !== "0"){
                         
                        	console.log(response);
                        } else {
                         	console.log(response);
                        }
                        

                    },
                    function(response) {
                 		console.log(response);

                    }
                )
        } else {
        	console.log("Password do not match.");
        }
    }



  

})