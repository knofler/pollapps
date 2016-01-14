'use strict';

angular.module('poll')
 .controller('LoginCtrl', function ($scope, Auth, $location, $window,$cookies,$cookieStore) {
    $scope.user        = {};
    $scope.errors      = {};
    $scope.ldap_errors = {};

    //cache user credentials
    console.log($cookieStore.token);

    //Check if user email is remembered in cookies
    if(Object.keys($cookies).length >0 ){
      $scope.user.email = $cookies.email;
      $scope.user.password = $cookies.password;
      $scope.rememberMe = true;
     }

    $scope.login      = function(form) {
      $scope.submitted = true;

      if(form.$valid) {

      //Code for remember me feature
       if($scope.rememberMe){
          $cookies.email = $scope.user.email;
          $cookies.password = $scope.user.password;
          // console.log("email from cookies : ",$cookies.email);
          // console.log("password from cookies : ",$cookies.password); 
        }else{
        $cookieStore.remove('email');
        $cookieStore.remove('password');
        $cookieStore.remove('token');
        }  

        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
     };
    $scope.loginLdap  = function(form) {
      $scope.ldap_submitted = true;

      if(form.$valid) {
        Auth.ldapLogin({
          email: $scope.ldap_user.email,
          password: $scope.ldap_user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.ldap_errors.other = err.message;
        });
      }
     };
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
     };
  });
