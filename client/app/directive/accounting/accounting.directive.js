'use strict';

angular.module('poll')
  .directive('accounting', function ($http,socket) {
    return {
      templateUrl: 'app/directive/accounting/accounting.html',
      restrict: 'EA',
      scope:{
      	data:'='
      },
      link: function (scope, element, attrs) {

       //properties 
       scope.years    = ['2016','2015','2014','2013','2012','2011'];
       scope.calendar = [
  		    {month:'jan',seq:1,days:31},
  		    {month:'feb',seq:2,days:28},
  		    {month:'mar',seq:3,days:31},
  		    {month:'apr',seq:4,days:30},
  		    {month:'may',seq:5,days:31},
  		    {month:'jun',seq:6,days:30},
  		    {month:'jul',seq:7,days:31},
  		    {month:'aug',seq:8,days:31},
  		    {month:'sep',seq:9,days:30},
  		    {month:'oct',seq:10,days:31},
  		    {month:'nov',seq:11,days:30},
  		    {month:'dec',seq:12,days:31}
         ];
       scope.data['monthDays']  = 0;
	     scope.data['monthSeq']   = 0;


       //methods
   	   scope.changeMonth     = function () {
          // alert(scope.formdata.catName);
          scope.select_month = scope.formdata.month;
          console.log("scope.select_month :: ", scope.select_month);
          scope.calendar.forEach(function(d,key){
      	    // console.log("calendar data :: ", d.month, key);
      	    if (scope.select_month === d.month){
      	       scope.data['monthSeq'] = d.seq -1;
      	       scope.data['monthDays']  = d.days+1;
      	       // console.log("seq is: ", d.seq);
      	       // console.log("monthSeq is: ", scope.data['monthSeq']);
      	       // console.log("monthDays is: ", scope.data['monthDays']);
      	    }
      	   });

        	$http.get(scope.data.url+'month',{
            params:{
              month:scope.data['monthSeq'],
              days:scope.data['monthDays']
              }
            }).success(function(selectEntry){
              // console.log("selectEntry :: ", selectEntry);
              scope.poll_items = selectEntry;
              socket.syncUpdates(scope.data.model,scope.poll_items);   
              // this socket has emited to change the X axis of chart with appropriate data from data model 
              // socket.socket.emit('changeChartX',{topic:select_topic});
            })
         };  
  	   scope.changeYear      = function () {
          // alert(scope.formdata.catName);
          scope.select_year = scope.formdata.year;
           // $http.get(scope.data.url+'topic',{
           //      params:{
           //        topic:select_topic
           //      }
           //    }).success(function(selectEntry){
           //      console.log("selectEntry :: ", selectEntry);
           //      scope.poll_items = selectEntry;
           //      socket.syncUpdates(scope.data.model,scope.poll_items);   
           //      // this socket has emited to change the X axis of chart with appropriate data from data model 
           //      socket.socket.emit('changeChartX',{topic:select_topic});
           //  })
          // scope.csv_chart['url'] = '/assets/dataDir/'+scope.select_year+'/'+scope.select_month+'.csv';
          // console.log("$scope.csv_chart['url'] is ", scope.csv_chart['url'])
         };  
		

      }//end of link
    };//end of return
  });//end of directive