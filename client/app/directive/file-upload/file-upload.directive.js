'use strict';

angular.module('poll')
  .directive('fileUpload', function (FileUploader) {
    return {
      templateUrl: 'app/directive/file-upload/file-upload.html',
      restrict: 'EA',
      scope:{
       uploader   :'=',
       chart      :'=' 
      },
      link: function (scope, element, attrs) {

        // console.log("upload :: ", scope.uploader);

        //grab formdata inputs;
        scope.formdata = {};

        //IMAGE UPLOAD VARIABLE
        var mediaLocation   = '';
        var cloudinary_url  = 'http://res.cloudinary.com/hsotahhow/image/upload/';
        var aws_url         = 'https://s3-ap-southeast-2.amazonaws.com/testmedata/';
        var preset_url      = '/assets/images/uploads/';
        var preset_url_dist = '/assets/img/uploads/';

        /*
            Function to get the temporary signed request from the app.
            If request successful, continue to upload the file using this signed
            request.This is required for AWS, which requires signed request
        */
        scope.upload_file                 = function (file, signed_request, url){
          var xhr = new XMLHttpRequest();
          xhr.open("PUT", signed_request);
          xhr.setRequestHeader('x-amz-acl', 'public-read');
          xhr.onload = function(data) {
              console.log("file uploaded")
          };
          xhr.onerror = function() {
              alert("Could not upload file."); 
            };
            xhr.send(file);
            // console.log("file in XHR is :", file)
          };
        scope.get_signed_request          = function (file){
          var xhr = new XMLHttpRequest();
          xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type);
          xhr.onreadystatechange = function(){
              if(xhr.readyState === 4){
                  if(xhr.status === 200){
                      var response = JSON.parse(xhr.responseText);
                      // console.log("response from AWS before upload is:::", response );
                      scope.upload_file(file, response.signed_request, response.url);
                  }
                  else{
                      alert("Could not get signed URL.");
                  }
              }
          };
          xhr.send();
         }
        //File Upload to Cloud storage, in this case AWS
        scope.uploader.onBeforeUploadItem = function (fileItem) {
          //clean the upload queue everytime before upload starts
          scope.uploader.queue = [];
          console.info('onBeforeUploadItem', fileItem);
          // scope.formdata['img'] = preset_url+scope.data.model+"/"+fileItem.file.name
          // console.info('image name before space removal is ', fileItem.file.name);
          var noSpaceFileName = fileItem.file.name.replace(/\s/g, '')
          console.log('file name after space removal is ', noSpaceFileName)
          mediaLocation = aws_url+noSpaceFileName;
          scope.url = mediaLocation;
          //assign scope.url to chart[url] attribute for dropped csv, to get the chart
          scope.chart.url = scope.url; 
          console.log("scope.url",scope.url);
         };
        scope.dropFile                    = function (){
          //on dropfile method execution,hide timeseries control
          $('.xAxisctrl').hide();
          console.log("timeseries : ", scope.formdata.timeseries, "xaxis : ", scope.formdata.base);
            
            if(scope.formdata.timeseries ==='yes'){
              scope.chart.base = scope.formdata.base;
              scope.chart.axistype = 'timeseries';
            }else{
              scope.chart.base = '';
              scope.chart.axistype = '';
            }
          
          _.each(scope.uploader.queue,function(data){
          
            console.log("data in each loop is :", data)
            // console.log('data inside scope.uploader.queue :: ', data._file);

            //push file to get aws signed for upload, document first get signed and then uploaded to AWS S3, then after 1000 millisecond render locally
            scope.get_signed_request(data._file);
            setTimeout(function(){
               data.upload();
            },1000)
           
          })
          console.log("file dropped event fired");
          scope.formdata = {};
         }; 
        
        // Process starts from here. On file drop in this div, above function starts executing in a row 
        $("#filedrop").on('drop',function(e){
         // $("#display_csv_panel").empty();
         //on dropfile event,shoe timeseries control
         $('.xAxisctrl').show();
         // scope.dropFile();	
          });


      }//end of link
    };//end of return
  });//end of directive