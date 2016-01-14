'use strict';

angular.module('poll')
  .directive('editforms', function ($http,socket) {
    return {
      templateUrl: 'app/directive/editforms/editforms.html',
      restrict: 'EA',
      scope:{
      	id 	   		:'@',
      	data    	:'='
      },
      link: function (scope, element, attrs) {

      	//Control visual with ng-show
      	scope.view = true; 
      	
      	//holds initial fields data from getEditData
      	scope.fields   = {};

      	//Hold form edit datas
      	scope.formEditData = {};

      	//get form data pre populated
      	scope.geteditdata = function (){
      		//change view to false to go to edit mode
      		scope.view = false;

      		console.log("Incoming id from controller is : ", scope.id);
      		var url = scope.data.url+scope.id;
      		console.log("url is ", url);
      		$http.get(url).success(function(data){
      			console.log("payload is ",data);
      			scope.fields = data;
      		 });

      	 }; 

      	//Submit edited forms data to database
      	scope.editform = function () {
			
          scope.formEditData['edited_at'] = new Date(); 
    			var url = scope.data.url+scope.id;
          		console.log("url is ", url);
    	  		
    	  		// $http.post(scope.url,scope.editdata);
          		$http.put(url,scope.formEditData).success(function(update){
          				console.log("after update is :", update);
          				 socket.syncUpdates(scope.model, update);
          			});
          		scope.formEditData = {};
          		scope.geteditdata();

    			//change view to true to get back to view mode
          		scope.view = true;
  		   }; 

      }
    };
  });