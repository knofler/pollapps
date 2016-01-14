'use strict';

angular.module('poll')
  .directive('addforms', function ($http,socket,Auth,FileUploader,pageCtrlSrv) {
    return {
      templateUrl: 'app/directive/addforms/addforms.html',
      restrict: 'EA',
      scope:{
        data   :'=',
        image  :'=', 
        multiple: '=',
        closeModal:'&modalctrl'
      },
      link: function (scope, element, attrs) {

        //control multiple image upload with this conditions
        // console.log("scope.multiple :: ",scope.multiple)
        console.log("scope.data.array is : ", scope.data.array);

        var queueNumber ;
        if(scope.multiple === false){
          queueNumber =1;
         }
         else{
          queueNumber = 25;
         }
          // console.log("queueNumber :: ",queueNumber)
        
        //instantiate Fileuploader to pass on to photos directive
        scope.uploader = new FileUploader({
          // url: '/uploads'
          queueLimit: queueNumber
         });

        // console.log("upload :: ", scope.uploader);
        // console.log("scope.data is ", scope.data.options);

      	//Object holds formdata
      	scope.formdata       = {};

        //control mechanism to manage items for display and add forms
        scope.select = true;
        scope.text   = false;
      	
        //get user info
        scope.getCurrentUser = Auth.getCurrentUser;

        // Collect User Geo Location using geo-location element    
        scope.getLatitude  = '';
        scope.getLongitude = '';
        
        scope.loc = document.querySelector('geo-location');
        console.log("scope.loc is :: ", scope.loc)

        
        scope.loc.addEventListener('geo-response', function(e) {
          scope.getLatitude  = this.latitude;
          scope.getLongitude = this.longitude;
          console.log('lat:' + scope.getLatitude,'lng:' + scope.getLongitude);
         });   

        //IMAGE UPLOAD VARIABLE
        var mediaLocation   = [];
        var cloudinary_url  = 'http://res.cloudinary.com/hsotahhow/image/upload/';
        var preset_url      = '/assets/images/uploads/';
        var preset_url_dist = '/assets/img/uploads/';
        
        //get image name from uploadsed image

        //CLOUDINARY IMAGE UPLOAD
        scope.uploader.onBeforeUploadItem = function(fileItem) {
          console.info('onBeforeUploadItem', fileItem);
          // scope.formdata['img'] = preset_url+scope.data.model+"/"+fileItem.file.name
          // console.info('image name before space removal is ', fileItem.file.name);
          var noSpaceFileName = fileItem.file.name.replace(/\s/g, '')
          console.log('image name after space removal is ', noSpaceFileName)
          mediaLocation.push(cloudinary_url+noSpaceFileName);
          scope.formdata['img'] = mediaLocation;
          console.log("scope.formdata",scope.formdata);
         };
  
        // LOCAL IMAGE UPLOAD
        // $scope.uploader.onBeforeUploadItem = function(fileItem) {
        //   console.info('onBeforeUploadItem', fileItem);
        //     mediaLocation.push(preset_url+fileItem.file.name);
        //   console.log("media location is: ",mediaLocation);
        //  };
  
        //Add forms data to database
        scope.add = function () {
          if(_.isEmpty(scope.formdata)){
            alert("No Data");
            return;
            }else{
              scope.formdata['created_at'] = new Date();
              scope.formdata['created_by'] = scope.getCurrentUser().name;   
              scope.formdata['latitude']   = scope.getLatitude;
              scope.formdata['longitude']  = scope.getLongitude;
              // console.log("scope.formdata is : ", scope.formdata);

              //check if any defined fields has array requirements
              _.each(scope.data.fields, function(d){
                // console.log("each d is :", d);
                if(d.name === scope.data.array){
                  //this means, d.name field is array
                  scope.arrData = scope.formdata[d.name].split(',');
                  // console.log("data from array field is :: ",scope.formdata[d.name] )
                  // console.log("arrData is  :: ",scope.arrData )
                  // console.log("scope.data.array is : ", scope.data.array);

                 }//end of array confirmation and data array build if
               });//end of _each for array check

              // console.log("arrData outside is  :: ",scope.arrData );

              if(scope.data.array !== undefined){
                var item  = scope.data.array; 
                var topic = scope.formdata['poll_head'];
                console.log("item is :: ",item);
                $http.post(scope.data.catUrl,{
                   'catTopic'   : scope.data.model,
                   'catName'    : topic,
                   'catOption'  : scope.arrData,
                   'created_at' : new Date(),
                   'created_by' : scope.getCurrentUser().name,   
                   'latitude'   : scope.getLatitude,
                   'longitude'  : scope.getLongitude
                 }).success(function(data){
                  console.log("data submited to category is :: ", data.catName)
                   console.log("category added and so does poll, so time to emit socket once for push update UI");
                    //this socket has emited to display last poll added to the system
                    socket.socket.emit('pollAdded',{data:data});
                    // this socket has emited to change the X axis of chart with appropriate data from data model 
                    socket.socket.emit('changeChartX',{topic:data.catName});
                 });

                _.each(scope.arrData,function(d){
                  // console.log("d inside arrData is:: ", d);
                  // console.log("scope.formdata[scope.data.array] is:: ", scope.formdata[scope.data.array]);
                  // scope.formdata[scope.data.array] = d
                  // console.log("scope.formdata[scope.data.array] after assignment is:: ", scope.formdata[scope.data.array]);
                  // console.log("scope.formdata is:: ", scope.formdata);
                 $http.post(scope.data.url,{
                   'poll_head'  : scope.formdata['poll_head'],
                   'item'       : d,
                   'ratings'    : 0,
                   'created_at' : new Date(),
                   'created_by' : scope.getCurrentUser().name,   
                   'latitude'   : scope.getLatitude,
                   'longitude'  : scope.getLongitude
                   }).success(function(data){
                     console.log("submitted data is :: ", data);
                  });//end of array post success

                  // console.log("formdata is :: ",scope.formdata)
                  // console.log("I am exiting loop")

                 });//end of _each
                  // console.log("scope.formdata outside is:: ", scope.formdata);
               }else{
                $http.post(scope.data.url,scope.formdata).success(function(){
                 // console.log("datachange emits")
                 //this socket has emited for display class to reinitiate in pinterest style display page if real time display available
                 socket.socket.emit('datachange',{data:"Change model"});
                });
              }//end of array check if-else
            
            
             // **************Notification*********************
             var data = '<strong>'+scope.getCurrentUser().name+'</strong>' + ' added new record ' + scope.formdata[scope.data.fields[0].title] ;
             // console.log(data);  

             // Send notification broadcast to all connected users
             pageCtrlSrv.send_notification(data);
             //emty formdata for next insert
             scope.formdata = {};
             //close modal
             scope.closeModal();
           };//end of isEmpty if-else check
         }; //end of add function

      }//end of link
    };//end of return
  });//end of directive