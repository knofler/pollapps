'use strict';

angular.module('poll')
  .directive('photoMod', function ($http,socket,$modalInstance,Auth) {
    return {
      templateUrl: 'app/directive/photo-mod/photo-mod.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {


		  // $scope.AksWarnData  = delWarn.delData;
		  // $scope.image_to_del = delWarn.imgtoDel;

		  // console.log("AksWarnData is : ", $scope.AksWarnData[$scope.AksWarnData.length-1]._id);

		  scope.getCurrentUser = Auth.getCurrentUser;

		  scope.ok     = function () {
		    // licUpdate.removeLic($scope.licWarnData.userID,$scope.licWarnData.idOfOneID,$scope.licWarnData.application,$scope.licWarnData.licCount)
		    var aks_id = $scope.AksWarnData[$scope.AksWarnData.length-1]._id;
		    var original_media = $scope.AksWarnData[$scope.AksWarnData.length-1].mediaLocation.split(',');
		    console.log("original_media :: ",original_media);

		    var delIndex = 0;
		      original_media.forEach(function(val,key){
		        // console.log("key is: ", key ," and val is: ", val);
		        if($scope.image_to_del === val){
		          delIndex = key;
		        }
		      })

		    //pre url info to be removed to get the image name for img id  
		    var preurl = 'http://res.cloudinary.com/hsotahhow/image/upload/';

		    setTimeout(function(){
		      // console.log("delIndex is :: ",delIndex);
		      var slicedImg = original_media.splice(delIndex,1);
		      
		      console.log("original_media after splice is :: ",original_media);
		      //replace preurl to get image name with extension, then sliced to get just the name to be used as unique id for jquery target
		      var imgName = (slicedImg[0].replace(preurl,'')).slice(0,-4);
		      console.log("imgName before is :: ", imgName);

		     
		 
		      $http.put('/api/akss/'+aks_id,{
		          mediaLocation:original_media,
		          edited: new Date(),
		          edited_by:$scope.getCurrentUser()._id
		       }).success(function(){
		         $("#"+imgName).hide();
		         socket.syncUpdates('aks',original_media);
		       });
		    
		     },100)
    
    	   }


    	$modalInstance.close();
      }
    };
  });