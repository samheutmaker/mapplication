angular.module('MainController', [])


	.controller('HomeController', function($scope) {

		console.log("HomeController");

	})
.controller('LoginController', function($scope, $rootScope, $location, User) {


    $scope.loginInfo = {};

    $scope.login = function(){

         User.login($scope.loginInfo).then(function(loginResponse) {

            if(loginResponse.status !== "0"){

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
           
  });


    }


})


.controller('RegisterController', function($scope, $rootScope, $location, User) {

    $scope.registerInfo = {};

    $scope.register = function(){
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
                         	$rootScope.user = {
                                message: "Invalid Registration. Please try again."
                             };
                             console.log(registerResponse)
                        }
                    },
                    function(err) {
                 		 if(err.status === 1){

                             $rootScope.user = {
                                message: "That username is taken."
                             };
                          }
                    }
                )
        } else {
            $rootScope.user = {
                message: "Passwords do not match."
                             };
        }
    }
})
.controller('AccountController', function($scope, $rootScope, $location, User) {

    console.log("Account");



})


