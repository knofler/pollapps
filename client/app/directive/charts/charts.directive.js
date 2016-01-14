'use strict';

angular.module('poll')
  .directive('charts', function (charts,socket) {
    return {
      templateUrl: 'app/directive/charts/charts.html',
      restrict: 'EA',
      scope:{
      	data:'='
      },
	  controller:function($scope){
	  	 $scope.$watch('data.url', function (value) {
	         $scope.buildView(value);
	       });
	   },
      link: function (scope, element, attrs) {
      	//run build view function on url value change on csv drop
      	scope.buildView = function (url) {
  		   // $("#display_csv_panel").empty();
           // console.log("url is ",url);
           scope.data.url = url;
    	   // $("#csvDrpNode").empty(".customTable");
	       // console.log("I am inside charts directive settimeout buildView")
	       scope.chart = new charts(scope.data);
		   scope.chartobj  = scope.chart.chartObj;
		   	//adjust date format based on data type
		   if (scope.data.dateFormat == 'iso'){
		 		scope.dateFormat = '%Y-%m-%dT%H:%M:%S.%LZ'
		 	 }else if (scope.data.dateFormat === 'd/m/y'){
		 	 	scope.dateFormat = '%d/%m/%Y'
		 	 }else if (scope.data.dateFormat === 'y-m-d'){
		 	 	scope.dateFormat = '%Y-%m-%d'
		 	 }

		   setTimeout(function(){
			// *****************Generate chart without data********************
			scope.apiChart = c3.generate({
				bindto:'#apiChart',
				data:{
					x:scope.data.base,
				    columns:scope.chartobj,
				    type:scope.data.type,
				    xFormat:scope.dateFormat
				},
				axis: {
					x:{
			        	type: scope.data.axistype,
			        	tick: {
			        		count: scope.data.tickCount,
			            	format:'%Y-%m-%d'
			        	}
			        }
			    }    
			 });
		   },500)	
         };

      	// console.log("scope.data is : ",scope.data);
      	//static calendar defined
		scope.calendar           = [
  		    {month:'January',seq:1,days:31},
  		    {month:'February',seq:2,days:28},
  		    {month:'March',seq:3,days:31},
  		    {month:'April',seq:4,days:30},
  		    {month:'May',seq:5,days:31},
  		    {month:'June',seq:6,days:30},
  		    {month:'July',seq:7,days:31},
  		    {month:'August',seq:8,days:31},
  		    {month:'September',seq:9,days:30},
  		    {month:'October',seq:10,days:31},
  		    {month:'November',seq:11,days:30},
  		    {month:'December',seq:12,days:31},
  		    {month:'All'}
         ];
      	scope.years              = [];
      	// get default year
        var now                  = new Date();
			
      	scope.chartTypes         = [{type:'area',display:'Area Chart'},
      								{type:'bar',display:'Bar Chart'},
      								{type:'donut',display:'Donut Chart'},
      								{type:'gauge',display:'Gauge Chart'},
      								{type:'line',display:'Line Chart'},
      								{type:'pie',display:'Pie Chart'},
      								{type:'scatter',display:'Scatter Plot'},
      								{type:'spline',display:'Spline Chart'},
      								{type:'step',display:'Step Chart'}     								
      							    ];     
       	
       	// instantiate charts service			
      	//check if it has any other defined route to get data from or just plain api default
      	if(scope.data.topic == undefined){
      		scope.chart = new charts(scope.data);
      	 }else{
      	 	console.log("topic is :: ", scope.data.topic);
      	 	scope.data.topic = 'last'
      	 	scope.chart = new charts(scope.data,scope.data.topic);
      	 }
	 	//assign chartObj to data model
	 	scope.chartobj  = scope.chart.chartObj;
	 	//adjust date format based on data type
	 	if (scope.data.dateFormat == 'iso'){
	 		scope.dateFormat = '%Y-%m-%dT%H:%M:%S.%LZ'
	 	 }else if (scope.data.dateFormat === 'd/m/y'){
	 	 	scope.dateFormat = '%d/%m/%Y'
	 	 }else if (scope.data.dateFormat === 'y-m-d'){
	 	 	scope.dateFormat = '%Y-%m-%d'
	 	 }


	    //C3 generate the graph for the first time on page on page load On Page load run
		setTimeout(function(){
			// *****************Generate chart without data********************
			scope.apiChart = c3.generate({
				bindto:'#apiChart',
				data:{
					x:scope.data.base,
				    columns:scope.chartobj,
				    type:scope.data.type,
				    xFormat:scope.dateFormat
				},
				axis: {
					x:{
			        	type: scope.data.axistype,
			        	tick: {
			        		count: scope.data.tickCount,
			            	format:'%Y-%m-%d'
			        	}
			        }
			    }    
			 });
		   },500)	
		// Graph function to update graph with new data 
		scope.graph           =  function () {
			// console.log("Graph will be rendered by this function")
			// console.log("chartData before update is ", scope.chartData);
			// console.log("update data is ", scope.updateData)
			scope.chart.update(scope.data.updateData);
			// console.log("chartData after update is ", scope.chartData);
			// scope.chart.chartObj.push(scope.updateData);
			// console.log("ChartObj after push is  ", scope.chart.chartObj); 
			// On chart update emit notification
			scope.chart.notify("chart");
		 };	 
		//methods
   	    scope.processDate     = function (now){
   	    	var month          = now.getMonth() +1;
   	    	var year           = now.getFullYear();

   	       //generate last 10 years from today		
   	       for (var i=0;i<10;i++){
   	       	 scope.years.push(year-i)
   	        };
   	        
   	    	
   	    	console.log("Month is :: ", month);
   	    	scope.data['year'] = year ;
   	    	console.log("Year is :: ", year);
   	    	scope.calendar.forEach(function(d,key){
	      	    // console.log("calendar data :: ", d.month, key);
	      	    if (month === d.seq){
	      	       scope.data['monthSeq'] = d.seq -1;
	      	       scope.data['monthDays']  = d.days+1;
	      	       console.log("seq is: ", d.seq);
	      	       console.log("monthSeq is: ", scope.data['monthSeq']);
	      	       console.log("monthDays is: ", scope.data['monthDays']);
	      	    }
      	    });
   	     };
   	    scope.changeMonth     = function (month) {
          // alert(scope.formdata.catName);
          scope.select_month = month || scope.formdata.month;
          console.log("scope.select_month :: ", scope.select_month);
          if(month){
          	scope.calendar.forEach(function(d,key){
	      	     // console.log("calendar data running for injected month:: ",month, d.month, key);
	      	     if (month === d.seq){
	      	       scope.data['monthSeq'] = d.seq -1;
	      	       scope.data['monthDays']  = d.days+1;
	      	       // console.log("seq is: ", d.seq);
	      	       // console.log("monthSeq is: ", scope.data['monthSeq']);
	      	       // console.log("monthDays is: ", scope.data['monthDays']);
	      	      }
	      	     });
           }else{
	          if(scope.select_month ==='All'){
	          	 scope.reload_onChange('yearChange','year');	
	          }else{
		        scope.calendar.forEach(function(d,key){
	      	     // console.log("calendar data :: ", d.month, key);
	      	     if (scope.select_month === d.month){
	      	       scope.data['monthSeq'] = d.seq -1;
	      	       scope.data['monthDays']  = d.days+1;
	      	       // console.log("seq is: ", d.seq);
	      	       // console.log("monthSeq is: ", scope.data['monthSeq']);
	      	       // console.log("monthDays is: ", scope.data['monthDays']);
	      	      }//end of inner if
	      	     });//end of for each function
            }//end of All logic if-else
           }//end of month or select_month if-else
          
          //reload data 
          scope.reload_onChange('monthChange','month');	
         };   
		scope.changeYear      = function (year) {         		
          // alert(scope.formdata.catName);
          scope.select_year = year || scope.formdata.year;
          console.log("scope.select_month :: ", scope.select_month);
          scope.data['year'] = scope.select_year;
          //reload data 
          scope.reload_onChange('yearChange','year');	
          // scope.reload_onChange('monthChange','month');	
         };   
		scope.changeChartType = function () {
          // alert(scope.formdata.catName);
          scope.select_chartType = scope.formdata.chartType;
          console.log("scope.select_chartType :: ", scope.select_chartType);
          scope.data['type'] = scope.select_chartType;
          //reload data 
          scope.reload_onChange('chartType');	
         };   
		// ************Load Data **************************
		//loadData function to re render the graph with new data
		scope.loadData        = function (){
			console.log("loaddata being executed by socket", scope.chartobj);
			setTimeout(function(){
			  scope.apiChart.load({
				columns:scope.chartobj,
				type:scope.data.type
			   })
			 },500)  
		 };
		scope.reload_onChange = function (name,change){
			if(name === 'chartType'){
				if (scope.chartobj == ''){
					 scope.chart = new charts(scope.data);
					 scope.chartobj  = scope.chart.chartObj;
					 scope.loadData();
					}else{
					  scope.chartobj  = scope.chart.chartObj;
					  scope.loadData();
					}
			}else{
			  if(name === 'topic'){
			  	scope.chart = new charts(scope.data,change);
			  }else{
			    scope.chart = new charts(scope.data,'',change);
			   }
			  //assign chartObj to data model
		 	  scope.chartobj  = scope.chart.chartObj;
			  scope.loadData();
			}   
		 };
		//On xAxisChange Socket notification change xAxis data on the graph
		socket.socket.on('xAxisChange',function(data){
		  console.log("xAxisChange running ", data.data);
		  scope.reload_onChange('topic',data.data.topic);	
		 });
		//On Socket notification update graph
		socket.socket.on('updateGraph',function(data){
		  // console.log("update_graph data ",  data)
		  scope.loadData();
		 });
		//On column drop run graph function
		socket.socket.on('runChartUpdate',function(data){
		  // console.log("runChartUpdate data ",  data)
		  scope.graph();
		 });
		//On voting execution run graph function to reflect vote result
		socket.socket.on('chartViewChange',function(data){
		  // console.log("runChartUpdate data ",  data)
		  scope.graph();
		 });
	  
		socket.socket.on("appendDataView",function(data){
	          	console.log('appendDataView socket arrived with data', data);
	            var gotDate = new Date(data.update.created_at),
	          	month_to_use = gotDate.getMonth() +1,
	          	year_to_use = gotDate.getFullYear();
	          	console.log("Months is : ", month_to_use);
	          	console.log("Year is : ", year_to_use);
	          	if(scope.data.liveupdate === data.model){
	          	  scope.changeMonth(month_to_use);
	          	  console.log("Chart updated as Live update requested for ",data.model )
	          	 }
	           });
	    socket.socket.on("updateDataView",function(data){
	          	console.log('updateDataView socket arrived with data ', data.update.created_at);
	          	var gotDate = new Date(data.update.created_at),
	          	month_to_use = gotDate.getMonth() +1,
	          	year_to_use = gotDate.getFullYear();
	          	console.log("Months is : ", month_to_use);
	          	console.log("Year is : ", year_to_use);
	          	if(scope.data.liveupdate === data.model){
	          	    scope.changeMonth(month_to_use);
	          	  console.log("Chart updated as Live update requested for ",data.model )
	          	 }
	          });


		// process default date,year,month value
		scope.processDate(now); 

	  }//end of link
    };//end of retuen
  });//end of directive