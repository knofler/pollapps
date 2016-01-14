'use strict';

angular.module('poll')
   .directive('modals', function () {
    return {
      templateUrl: 'app/directive/modals/modals.html',
     restrict: 'E',
    scope: {
      show: '=',
      top:'=',
      background:'=',
      close : '&hide'
    },
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };

      //change modal top 
      $(".ng-modal-dialog").css("top",scope.top);
      // change mode background
      $(".ng-modal-overlay").css("background",scope.background)

      }//end of link
    };//end of return
  });//end of directive