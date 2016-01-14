'use strict';

angular.module('poll')
.controller('ModalDisplayInstanceCtrl', function ($scope,$http,socket,pageCtrlSrv,$modalInstance,$filter) {
		    console.log("$scope.showmodalinfo is " , $scope.showmodalinfo)
			var url = $scope.showmodalinfo.url+"/"+$scope.showmodalinfo.id;

		  	$http.get(url).success(function(gotData){
		  	  $scope.displayData = gotData;	
		  	  $scope.showmodalinfo.fields.forEach(function(data){
		  	  	// console.log("data is ", data.type);
		  	  	if (data.type === 'number'){
		  	  		$scope.displayData[data.name] = $filter('currency')($scope.displayData[data.name]);
		  	  		// console.log("found number type data", $scope.displayData[data.name])
		  	  	}else if( data.type === 'date'){
		  	  		$scope.displayData[data.name] = $filter('date','yyyy-MM-dd')($scope.displayData[data.name]);
		  	  		// console.log("found date type data", $scope.displayData[data.name])
		  	  	}else if( data.type === 'text'){
		  	  	
		  	  	}
		  	  })
		  	  socket.syncUpdates($scope.showmodalinfo.model,$scope.displayData);
		  	 });

		  	//control mechanism to manage items for display and add forms
		    // $scope.number = true;
		    // $scope.text   = false;

			$scope.ok     = function () {
			    $modalInstance.close();
			   };
			$scope.cancel = function () {
			    $modalInstance.dismiss('cancel');
			   };
	     })
.controller('ModalAddInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth,$cookies) {
		  
   console.log("$scope.addmodalinfo is " , $scope.addmodalinfo)
   var url = $scope.addmodalinfo.url;
   console.log("add model is :: ", $scope.addmodalinfo.model);
   
   $scope.formData       = {};
   $scope.getCurrentUser = Auth.getCurrentUser;
   $scope.userInfo       = [];

   //control mechanism to manage items for display and add forms
   $scope.select = true;
   $scope.text   = false;

   //get last inserted id
   $scope.getLastEntry($scope.addmodalinfo.tabname); 

   $scope.add    = function () {
   		$scope.formData['created']    = new Date();
        $scope.formData['created_by'] = $scope.getCurrentUser().name;   
        $scope.formData['latitude']   = $scope.getLatitude;
        $scope.formData['longitude']  = $scope.getLongitude;

        //Add data to database
        $http.post(url,$scope.formData).success(function(senddata){
        	socket.socket.emit("data_added",{
        		model:$scope.addmodalinfo.model,
        		update:senddata
        	});
        });

        // console.log("Purchase record of  : " + $scope.formData.faculty_ref + " created at " + new Date() + " by " + $scope.getCurrentUser().name);
         
        // **************Notification*********************
        var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' added new record ' + $scope.formData[$scope.addmodalinfo.fields[0].title] ;
        // console.log(data);  

        // Send notification broadcast to all connected users
        pageCtrlSrv.send_notification(data);


        //add information to cookies
        if(Object.keys($cookies).length >0 ){
          $cookies.purchase = true;
          console.log($cookies);
         }

		  $modalInstance.close();
	 };
   $scope.ok     = function () {
	    $modalInstance.close();
	   };
   $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');   
	    };
  	    	
  	    	})
.controller('ModalEditInstanceCtrl',function ($scope,socket,$http,pageCtrlSrv,$modalInstance,Auth) {
		  
	$scope.EditformData    = {}; 
	$scope.getCurrentUser  = Auth.getCurrentUser;
	$scope.userInfo        = [];

	var url = $scope.editmodalinfo.url+"/"+$scope.editmodalinfo.id;
	console.log("edit url is :: ", url);
	console.log("edit model is :: ", $scope.editmodalinfo.model);


	$http.get(url).success(function(gotData){
        $scope.EditData = gotData;
        socket.syncUpdates($scope.editmodalinfo.model,$scope.EditData)
     });

	//control mechanism to manage items for display and add forms
    $scope.select = true;
    $scope.text   = false;

	$scope.edit    = function (itemID){

	   
	 //update tables with form data
	  $scope.EditformData['edited']    =  new Date();
      $scope.EditformData['edited_by'] = $scope.getCurrentUser()._id;
      $scope.EditformData['latitude']  = $scope.getLatitude;
      $scope.EditformData['longitude'] = $scope.getLongitude;
  
     $http.put(url,$scope.EditformData).success(function(senddata){
        	socket.socket.emit("data_updated",{
        		model:$scope.editmodalinfo.model,
        		update:senddata
        	});
        });
    
     // console.log("Purchase record  : " + $scope.EditData[$scope.EditData.length-1].faculty_ref + " edited at " + new Date() + " by " + $scope.getCurrentUser().name);
   
     // **************Notification*********************
     var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' edited record ' + $scope.editmodalinfo.id ;
     // console.log(data);  

     // Send notification broadcast to all connected users
     pageCtrlSrv.send_notification(data);
   
	    $modalInstance.close();
	    }; 
	$scope.ok      = function () {
	    $modalInstance.close();
	  };
	$scope.cancel  = function () {
	    $modalInstance.dismiss('cancel');
	   };
  	})
.controller('ModalDeleteInstanceCtrl',function ($scope,$http,pageCtrlSrv,socket,$modalInstance,Auth) {
  
	var url = $scope.deletemodalinfo.url+"/"+$scope.deletemodalinfo.id;
	console.log("edit url is :: ", url);

	$http.get(url).success(function(gotData){  
      $scope.DeleteData = gotData;
      socket.syncUpdates($scope.deletemodalinfo.model,$scope.deleteData)
     });

  	$scope.getCurrentUser     = Auth.getCurrentUser;

    $scope.ok     = function () {
	    $http.delete(url).success(function(){
	      // console.log("Purchase Record : " + $scope.purchaseDeleteData[$scope.purchaseDeleteData.length -1].faculty_ref + " deleted at " + new Date() + " by " + $scope.getCurrentUser().name);
	      
	      // **************Notification*********************
	      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' deleted '+ $scope.deletemodalinfo.model+ ' record ' + $scope.DeleteData[deletemodalinfo.fields[0]].title; 	
	      // console.log(data);  

	      // Send notification broadcast to all connected users
	      pageCtrlSrv.send_notification(data); 
	     });
	    $modalInstance.close();
	    };
    $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
 	      })
.controller('ModalCSVInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {

		  var url = '/api/'+$scope.tabname;
		  // making pageCtrlSrv function available for the controller
		  $scope.csvOut    = pageCtrlSrv.csvOut;
		  console.log("pageCtrlSrv.tabname is : ", $scope.tabname)
		  //get all colums fields available from the dataRepo
		  $http.get(url).success(function(gotData){
		  	$scope.dataRepo = gotData;
		  	$scope.columns = Object.keys($scope.dataRepo[0]);
		  });
		  // $scope.columns = Object.keys(pageCtrlSrv.purchaseRepo[0]);
		  // console.log($scope.columns);
		  //grab modal form input as custom field options for reporting
		  $scope.formData        = {};
		  //get all data for each selected id and store in this array.
		  $scope.selectDataArray = [];
		  //auth service call 
		  $scope.getCurrentUser  = Auth.getCurrentUser;

		  $scope.getCustomReport = function(){
		    var customData = [];
		    //insert field choices and selected rows data into customData array.
		    $scope.selectDataArray.forEach(function(getEachRow){
		      $scope.formData.columns.forEach(function(getEachColumn){
		        // console.log("for each row data is : ", getEachRow);
		        // console.log("for each row coulmn selected is : ", getEachColumn);
		        // console.log("for each row Custom data auto select is : ", getEachRow[getEachColumn]);
		        customData.push(getEachRow[getEachColumn]);
		       });
		      // console.log('customData is : ' , customData);
		     });
		    console.log("total fields ",$scope.formData.columns.length);
		    //push customData array for csv conversion
		     $scope.csvOut(customData,$scope.formData.columns.length,$scope.formData.columns);
		    //close modal after updated
		    $modalInstance.close(); 
		   };
  
		  //run function on every selected items
		  $("input:checked").each(function(){
		    $http.get(url+this.id).success(function(getData){
		     $scope.selectDataArray.push(getData); 
		      // console.log(getDevice);
		     });
		  });

		  //   // **************Notification*********************
		  // setTimeout(function(){
		  //  var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' added ' + deviceData.length + ' devices.';
		  //  // console.log(data);  

		  //  // Display successfull message  
		  //  $("#deviceSuccess")
		  //  .show()
		  //  .html("<h4>You have successfully added " + deviceData.length + " devices to inventory.</h4>")
		  //  .delay(7500)
		  //  .fadeOut("slow")

		  //  // Send notification broadcast to all connected users
		  //  pageCtrlSrv.send_notification(data);
		  //  },1000);
  
		  $scope.ok            = function () {
		    $modalInstance.close();
		  };
		  $scope.cancel        = function () {
		    $modalInstance.dismiss('cancel');   
		 };
  	   		})
.controller('ModalUserInfoInstanceCtrl',function ($scope,userInfo,pageCtrlSrv,oneID,$modalInstance) {
      //Access userInfo function for user profile data.
      userInfo.userProfile(oneID);

      //Access pageCtrlSrv function for showing application data
      $scope.showData = pageCtrlSrv.showData;

      $scope.ok = function () {
        $modalInstance.dismiss('cancel');
        };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        };
      })
.directive('tabs', function ($http,socket,pageCtrlSrv,userInfo,Auth,$timeout,$filter) {
    return {
      templateUrl: 'app/directive/tabs/tabs.html',
      restrict: 'EA',
   
      link: function (scope, element, attrs) {

      	  //get user info
		  scope.getCurrentUser = Auth.getCurrentUser;
		  var rootRepo = scope.data.model+"Repo"
		  console.log("rootRepo is : ", rootRepo)

	      $http.get(scope.data.url).success(function(getData){
	            scope.dataRepo=getData;
	            // console.log("scope.dataRepo is : ", scope.dataRepo);
	          	// console.log("data is ", scope.data.fields);
	          	scope.dataRepo = scope.formatData(getData);
	          	
	             scope.columns = Object.keys(scope.dataRepo[0]);
	             pageCtrlSrv[rootRepo] = scope.dataRepo;
	             // console.log("pageCtrlSrv[rootRepo] is ::", pageCtrlSrv.purchaseRepo)
	             socket.syncUpdates(scope.data.model,scope.dataRepo);
	          });

		  scope.formatData = function (data) {
			 	data.forEach(function(eachdata){
	          		scope.data.fields.forEach(function(eachfield){
		          		// console.log("each data.type is : " ,eachfield.type)
		          		// console.log("each data.name is : " ,eachfield.name)
		          		// console.log("scope.dataRepo[data.name]", eachdata[eachfield.name])
				  	  	if (eachfield.type === 'number'){
				  	  		eachdata[eachfield.name] = $filter('currency')(eachdata[eachfield.name]);
				  	  		// console.log("found number type data", scope.dataRepo)
				  	  	}else if( eachfield.type === 'date'){
				  	  		// eachdata[eachfield.name] = $filter('date','yyyy-MM-dd')(eachdata[eachfield.name]);
				  	  		// console.log("found date type data", scope.dataRepo[data.name])
				  	  	}else if( eachfield.type === 'text'){
				  	  		eachdata[eachfield.name] = $filter('capitalize')(eachdata[eachfield.name]);
				  	  	}
				  	  	// console.log("data.repo is :: ",scope.dataRepo);
			  	  	})
	          	});
	          	console.log("scope.formatData ran,now to return data");
	          	return data;
		     }	
          
 		

	      socket.socket.on("appendDataView",function(data){
	          	console.log('appendDataView socket arrived with data', data);
	          	// scope.formatData(data);
	           });
	      socket.socket.on("updateDataView",function(data){
	          	console.log('updateDataView socket arrived with data ', data);
	          	// scope.formatData(data);
	          });

      	  //pageCtrlSrv function available for application controller
	  	  scope.addModalData    = pageCtrlSrv.addModalData;
	  	  scope.deleteModalData = pageCtrlSrv.deleteModalData;
	  	  scope.editModalData   = pageCtrlSrv.editModalData;
	  	  scope.showModalData   = pageCtrlSrv.showModalData;
	  	  scope.userDetails     = pageCtrlSrv.popUsers;
	  	  scope.popCSV          = pageCtrlSrv.popCSV;

		  //pagination parameters  
		  scope.totalList   = false;
		  scope.searchBox   = false;
		  scope.totalItems  = '';
		  scope.currentPage = 1;
		  scope.pageSize    = 8;
		  scope.maxSize     = 10; //pagination max size is 10

		  //search pagination
		  scope.searchItems    = '';

		  //search pagination event
		  $(document).on('keyup','#input-search',function(){
		      scope.searchPag=true;
		      scope.searchflip = true;
		      $('#searchPag').show();
		      $('#searchflip').show();
		      var searchField = $('#input-search').val();
		        if(searchField == ''){
		          scope.searchPag=false;
		          scope.searchflip = false;
		          $('#searchPag').hide();
		          $('#searchflip').hide();
		        }      
		     });

		  //PAGE ACCESS CONTROL
		  // scope.hasReadAccess("application",Auth.getCurrentUser().email);


		  //pagination and page control functions
		  scope.setTotalItems  = function (){
				scope.totalItems= scope.dataRepo.length;
		   		};
		  scope.showAll        = function (){
	  			scope.totalItems= scope.dataRepo.length;
		    	scope.search='';  
				scope.totalList=true;
				scope.searchBox=true;
			    $('#searchPag').hide();
			    $('#searchflip').hide();
			   };
		  scope.searchData     = function (){
			      scope.currentPage =1;
			      scope.pageSize = 8;
			      scope.totalList=false;
			      scope.searchBox=false;
			      $('input:checkbox').removeAttr('checked');
			     };
		  scope.filter         = function (){
			   $timeout(function() { 
			      //wait for 'filtered' to be changed
			      /* change pagination with scope.filtered */
			      scope.searchItems= scope.filtered.length;
			      scope.totalItems = Math.ceil(scope.filtered.length/scope.pageSize);
			    }, 10);
			  };

		  scope.hasWriteAccess(scope.data.model,Auth.getCurrentUser().email);
		  scope.hasFullAccess(scope.data.model,Auth.getCurrentUser().email);	  
		  
		  //on directive load function run
		  setTimeout(function(){
          	scope.setTotalItems();
           },100);		  
			 
       }//end of loan
    };//end of return
  });//end of directive	




