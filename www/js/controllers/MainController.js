angular.module('MainController', [])


	.controller('HomeController', function($scope) {

		console.log("Hello");

	})
.controller('LoginController', function($scope, $rootScope, $location, User) {


    $scope.loginInfo = {};

    $scope.login = function(){

         User.login($scope.loginInfo).then(function(loginResponse) {

            if(loginResponse.status !== "0"){
               console.log(loginResponse);

               $rootScope.user = {
                    loggedIn: true,
                    data: loginResponse.data
               }

              $location.url('/account');

              

            } else {
             	console.log(response);
            }
                
                
    
        }, function(err) {
          
          if(err.status === 1){

             $rootScope.user = {
                message: "Incorrect username or password."
             };
          }

          console.log($rootScope.user.message);
           
  });


    }


})


.controller('RegisterController', function($scope, $rootScope, $location, User) {

    $scope.registerInfo = {};

    $scope.register = function(){
    	console.log("called");
        if($scope.registerInfo.password === $scope.registerInfo.passwordCheck) {
            User.register($scope.registerInfo).then(
                    function(registerResponse) {
                        if(registerResponse.status !== "0"){
                         
                        	$rootScope.user = {
                                loggedIn: true,
                                data: registerResponse.data
                            }

                             $location.url('/account');


                        } else {
                         	console.log(response);
                        }
                        

                    },
                    function(err) {
                 		 if(err.status === 1){

                             $rootScope.user = {
                                message: "Username taken."
                             };
                          }

                          console.log($rootScope.user.message);

                    }
                )
        } else {
        	console.log("Password do not match.");
        }
    }
})
.controller('AccountController', function($scope, $rootScope, $location, User) {

    console.log("Account");



})


