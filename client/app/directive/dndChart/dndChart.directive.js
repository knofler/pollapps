'use strict';

angular.module('poll')
  .directive('dndChart', function (socket) {
    return {
      templateUrl: 'app/directive/dndChart/dndChart.html',
      restrict: 'EA',
      scope:{
        colsData:'='
      },
      link: function (scope, element, attrs) {

        scope.centerAnchor        = true;
        scope.onDragSuccess       = function (data,evt){
          var index = scope.droppedObjects2.indexOf(data);
          if (index > -1) {
              scope.droppedObjects2.splice(index, 1);
          }
         }
        scope.onChartDropComplete = function (data,evt){

          console.log("column dropped here for chart is ",data)
            var index = scope.colsData.indexOf(data);
            if (typeof(data) == 'object'){
            console.log("data is :", data)
            var dataAdd = data.name
            if (index == -1){
              scope.colsData.push(dataAdd);
            }
          }else{
            if (index == -1){
              scope.colsData.push(data);
              console.log("scope.colsData is  ",  scope.colsData);
               // scope.render();
               console.log("column drop socket ran");
               socket.socket.emit('columnDrop',"Emit chart update");
            }
          }

         } 
      }
    };
  });