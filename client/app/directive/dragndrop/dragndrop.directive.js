'use strict';

angular.module('poll')
  .directive('dragndrop', function (socket) {
    return {
      templateUrl: 'app/directive/dragndrop/dragndrop.html',
      restrict: 'EA',
      scope:{
        dragElement :'=',
        colsData:'='
      },
      link: function (scope, element, attrs) {

        console.log(scope.dragElement)
        if(scope.dragElement !== undefined){
          scope.sample = true;
        }
   		  
        scope.centerAnchor     = true;
        scope.droppedObjects1  = [];
        scope.droppedObjects2  = [];

        scope.toggleCenterAnchor  = function () {scope.centerAnchor = !scope.centerAnchor}
        scope.onDragComplete      = function (data,evt){
          console.log("drag success, data:", data);
         }
        scope.onDropComplete      = function (data,evt){
          console.log("drop success, data:", data);
         }
        scope.onDropComplete1     = function (data,evt){
          var index = scope.droppedObjects1.indexOf(data);
          if (typeof(data) == 'object'){
            console.log("data is :", data)
            var dataAdd = data.name
            if (index == -1){
              scope.droppedObjects1.push(dataAdd);
            }
          }else{
            if (index == -1){
              scope.droppedObjects1.push(data);
            }
          }
         }          
        scope.onDragSuccess1      = function (data,evt){
          // console.log("133","scope","onDragSuccess1", "", evt);
          console.log("data dragged starts from  is ",data)
          var index = scope.droppedObjects1.indexOf(data);
          if (index > -1) {
              scope.droppedObjects1.splice(index, 1);
          }
         }
        scope.onDragSuccess2      = function (data,evt){
          var index = scope.droppedObjects2.indexOf(data);
          if (index > -1) {
              scope.droppedObjects2.splice(index, 1);
          }
         }
        scope.onDropComplete2     = function (data,evt){
        	console.log("Data dropped here complete is ",data)
            var index = scope.droppedObjects2.indexOf(data);
            if (typeof(data) == 'object'){
            console.log("data is :", data)
            var dataAdd = data.name
            if (index == -1){
              scope.droppedObjects2.push(dataAdd);
            }
          }else{
            if (index == -1){
              scope.droppedObjects2.push(data);
            }
          }
         }
        var inArray               = function (array,obj) {
          var index = array.indexOf(obj);
         }
      

      }
    };
  });