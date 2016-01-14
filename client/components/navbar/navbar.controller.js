'use strict';

angular.module('poll')
  .controller('NavbarCtrl', function ($scope, $location,userInfo, Auth) {
    $scope.menu               = [
      // {'title': 'Home','link': '/'},
      ];
    $scope.loggedinMenu       = [
     ]; 
    $scope.SuperloggedinMenu  = [
     ]; 

    $scope.isCollapsed    = true;
    $scope.isLoggedIn     = Auth.isLoggedIn;
    $scope.isAdmin        = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isSuper        = Auth.isSuper;

    $scope.check_access   = function(){
      if($scope.accessToRoute == ''){
        $scope.resource.forEach(function(res){
          $scope.accessControl(res,Auth.getCurrentUser().email);
        });
      }
     };
    $scope.logout         = function() {
      Auth.logout();
      $location.path('/login');
     };
    $scope.isActive       = function(route) {
      return route === $location.path();
     };
  
  });