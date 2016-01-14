'use strict';

angular.module('poll')
  .factory('main', function ($http,socket,Auth,$rootScope) {
    // Service logic
    // ...

    $rootScope.totalCost      = 0;
    $rootScope.currentOrderID = '';

    //methods
    var closeModal = function (){
        // $('.ng-modal-dialog').css("display","none");
        $('.ng-modal-dialog').hide();
       // $('.ng-modal-dialog').remove();
        // $('.ng-modal-overlay').css("background","none");
        // $('.ng-modal-overlay').remove();
        $('.ng-modal-overlay').hide();
     };

    // Public API here
    return {
        // closeModal:closeModal,
        totalCost      :$rootScope.totalCost,
        currentOrderID :$rootScope.currentOrderID
    };
  });
