'use strict';

angular.module('poll')
  .directive('file', function () {
    return {
      restrict: 'EA',
      scope:{
      	file:'@'
      },
      link: function (scope, element, attrs) {
         element.bind('change', function(event){
	        var files = event.target.files;
	        var file = files[0];
	        scope.file = file;
	        scope.$parent.file = file;
	        scope.$apply();
	      });
      }
    };
  });