'use strict';

angular.module('poll')
  .directive('poll', function ($http,socket,Auth,pageCtrlSrv) {
    return {
      templateUrl: 'app/directive/poll/poll.html',
      restrict: 'EA',
      scope:{
      	data:'='
      },
      link: function (scope, element, attrs) {
        
        //get data from url and display table on page load
        $http.get(scope.data.url+'last').success(function(data){
            var last_topic = data.poll_head
            $http.get(scope.data.url+'topic',{
                params:{
                  topic:last_topic
                }
              }).success(function(lastEntry){
                console.log("lastEntry :: ", lastEntry);
                scope.poll_items = lastEntry;
                socket.syncUpdates(scope.data.model,scope.poll_items);   
            })
           }); 
        //get data from cat-url to display category on page load
        $http.get(scope.data.catUrl+'category',{
          params:{
            cattopicdata:scope.data.model
           }
          }).success(function(data){
            scope.cat_items = data;
            socket.syncUpdates('category',scope.cat_items);
         });   

      	//get user info
        scope.getCurrentUser = Auth.getCurrentUser;

        // Collect User Geo Location using geo-location element    
        scope.getLatitude  = '';
        scope.getLongitude = '';
        scope.loc          = document.querySelector('geo-location');
        console.log("scope.loc is :: ", scope.loc);
        //get longitude and latitude information from the browser
        scope.loc.addEventListener('geo-response', function(e) {
          scope.getLatitude  = this.latitude;
          scope.getLongitude = this.longitude;
          console.log('lat:' + scope.getLatitude,'lng:' + scope.getLongitude);
         }); 

        //global variable for form data
      	scope.formdata = {};

        //On Socket notification update page
        socket.socket.on('pollViewChange',function(data){
          console.log("pollViewChange data ",  data)
             // scope.poll_items = data;
             scope.getLast();
         }); 

      	//Methods for this directive
      	scope.vote        = function () {
          // console.log("scope.formdata :: ", _.isEmpty(scope.formdata));
          if(_.isEmpty(scope.formdata)){
            alert("No Data");
            return;
          }else{
            console.log("scope.formdata.catName :: ",scope.formdata.catName);
            console.log("scope.poll_items :: ",scope.poll_items[scope.poll_items.length-1].poll_head);
            
            //assign right heading name to punch to voting table entry
            var heading = '';
            if(scope.formdata.catName == undefined){
              heading =scope.poll_items[scope.poll_items.length-1].poll_head
            }else{
              heading = scope.formdata.catName ;
            }//end of heading if-else
            
            var vote = scope.formdata.items;
            //delay process just to make sure heading properrly get time to value assigned
            setTimeout(function(){
               scope.formdata['voted_at']   = new Date();
               scope.formdata['voted_by']   = scope.getCurrentUser().name;   
               scope.formdata['poll_head']  = heading; 
               scope.formdata['item']       = vote;
               scope.formdata['latitude']   = scope.getLatitude;
               scope.formdata['longitude']  = scope.getLongitude;
               console.log("scope.formdata is : ", scope.formdata);
               //insert voter informaation to database
               $http.post(scope.data.voteUrl,scope.formdata).success(function(data){
                  console.log("data submited was: " , data)
                  console.log("datachange emits")
                  //this socket ready to carry out specific task
                  // socket.socket.emit('datachange',{data:"Change model"});
                 });
               console.log("scope.formdata.items is :: ",vote);
               $http.get(scope.data.url+'vote',{
                  params:{
                    vote_topic:heading,
                    vote_item:vote
                  }
               }).success(function(data){
                  $http.put(scope.data.url+data._id,{
                  'ratings':data.ratings+1
               }).success(function(data){
                  console.log("data submited was: " , data)
                  console.log("datachange emits")
                  //this socket has emited to propagate voting notification for other function to execute
                  socket.socket.emit('voted',{data:"Change chart"});
                });
               })
               


            },200);
          }//end of isEmpty if-else

           // **************Notification*********************
           // var data = '<strong>'+scope.getCurrentUser().name+'</strong>' + ' added new record ' + scope.formdata[scope.data.fields[0].title] ;
           // console.log(data);  

           // Send notification broadcast to all connected users
           // pageCtrlSrv.send_notification(data);

           scope.formdata = {};
      	   }//end of vote function 
        scope.getLast     = function () {
          //get data from url and display table
          $http.get(scope.data.url+'last').success(function(data){
            var last_topic = data.poll_head
            $http.get(scope.data.url+'topic',{
                params:{
                  topic:last_topic
                }
              }).success(function(lastEntry){
                console.log("lastEntry :: ", lastEntry);
                scope.poll_items = lastEntry;
                socket.syncUpdates(scope.data.model,scope.poll_items);   
            })
           }); 
         }//end of getLast function
        scope.changeTopic = function () {
          // alert(scope.formdata.catName);
          var select_topic = scope.formdata.catName;
           $http.get(scope.data.url+'topic',{
                params:{
                  topic:select_topic
                }
              }).success(function(selectEntry){
                console.log("selectEntry :: ", selectEntry);
                scope.poll_items = selectEntry;
                socket.syncUpdates(scope.data.model,scope.poll_items);   
                // this socket has emited to change the X axis of chart with appropriate data from data model 
                socket.socket.emit('changeChartX',{topic:select_topic});
            })
         };  
        // ################# MODAL DEPLOYMENT ################# 
        //modal top height adjustment
        scope.top ='260px';
        scope.background ='';
        //add forms content
  
        //modal controller 
        scope.modalShown    = false;
        scope.dynamic_forms = {};
        
        //modal methods

        scope.addPoll          = function () {
          scope.modalShown    = !scope.modalShown;
          // scope.dynamic_forms = scope.poll_data;
          console.log("scope.dynamic_forms is:: ", scope.dynamic_forms)
          // alert("Food Modal")
         }; 
        //pass functions to modal
        scope.close_directive_modal = function () {
          scope.modalShown    = false;
          console.log("I am from checkout directive and I have been executed")
         };  

        // ################# MODAL DEPLOYMENT #################  

      }//end of link
    };//end of return
  });//end of directive