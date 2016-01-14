'use strict';

angular.module('poll')
  .directive('databox', function ($http) {
    return {
      templateUrl: 'app/directive/databox/databox.html',
      restrict: 'EA',
       scope:{
      	apimodel:'='
      },
      link: function (scope, element, attrs) {

         scope.colList = [];

      	scope.getApi_model =  function (model){
      	 	var url = "/api/"+model;
      	 
      	 	console.log("url", url)
      	 	$http.get(url).success(function(payload){
      	 		// console.log(payload)
      	 		_.each(payload,function(eachRow,key){
      	 			// console.log(key)
      	 			if(key == 0){
      	 				// console.log(eachRow);
      	 				_.each(eachRow,function(colItem,key){
      	 					scope.colList.push(key);
      	 					 // console.log(colList)	
      	 				})
      	 			}
      	 		})
      	 	});
      	 	setTimeout(function(){
      	 		console.log("colList is : ", scope.colList)
      	 		return scope.colList;
      	 	},500);
        	}
      	// console.log('apimodel', scope.apimodel)
      	
        scope.getApi_model(scope.apimodel)
      }
    };
  });