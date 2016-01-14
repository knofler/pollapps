'use strict';

angular.module('poll')
  .factory('charts', function ($http,$filter,socket,$timeout) {
    //initiate Chart Class
    var Chart = function (obj,topic,segments) {
      this.chartObj     = [];
      this.names        = obj.columndata;
      this.model        = obj.model;
      this.url          = obj.url;
      this.csv          = this.isCsv(this.url);
      this.topic        = topic;
      this.month        = obj.monthSeq;
      this.days         = obj.monthDays;
      this.year         = obj.year;
      this.segment      = segments;
      // this.data();
      this.api();
      
      console.log("chart initialized with names: ", obj.columndata, ",model: ",obj.model, ",chartObj : ", this.chartObj, "topic : ", topic );
     } ;
    //define prototypes for the class 
    Chart.prototype.isCsv   = function (url) {
      var ext = url.substr(url.length - 3)
      // console.log ("url before split ext is :: ", ext);
      // var ext = url.split('.').pop();
      // console.log("url ",url);
      // console.log("ext ",ext);
      if(ext == 'csv'){
        return true;
      }else{
        return false;
      }
     };    
    Chart.prototype.api     = function () {
      // first check if it is a csv or api
      if(this.csv){
        d3.csv(this.url,function(err,payload){
            // console.log("csv payload is ", Object.keys(payload[0]));
            var names = Object.keys(payload[0]);
            var graphData = payload;
            this.data(names);        
            // console.log("graphData", graphData);
             // console.log("this.chartObj is : ", this.chartObj);
            for (var i = 0;i<this.chartObj.length;i++){
              for (var j = 0;j<graphData.length;j++){
                // console.log("each chartObj is ",this.chartObj[i]);
                // console.log("Graph Data for Each chartObj is ",graphData[j]);
                if(this.chartObj[i][0] == 'created' ){
                  this.chartObj[i].push($filter('date')(graphData[j]['created'], 'yyyy-MM-dd'));
                }else{
                  // console.log("Created not found so push others here")
                  // console.log("graphData[j][this.chartObj[i][0]] :: ", graphData[j][this.chartObj[i][0]])
                   this.chartObj[i].push(graphData[j][this.chartObj[i][0]])
                }//end of created if-else
              }//end of graphdata for loop
            }//end of chartobj for loop
            // socket.syncUpdates(model, this.chartObj);
         }.bind(this));
      }else if(this.segment == 'year'){
        this.data(this.names);
        $http.get(this.url+'year',{
            params:{
              year:this.year
              }
            }).success(function(res){
              if (res.length !== 0){
                var graphData = res;
                // console.log("graphData", graphData)
                for (var i = 0;i<this.chartObj.length;i++){
                  for (var j = 0;j<graphData.length;j++){
                    // console.log("each chartObj is ",this.chartObj[i]);
                    // console.log("Graph Data for Each chartObj is ",graphData[j]);
                    // if(this.chartObj[i][0] == 'created' ){
                    //   this.chartObj[i].push($filter('date')(graphData[j]['created'], 'yyyy-MM-dd'));
                    // }else{
                      // console.log("push others here")
                       this.chartObj[i].push(graphData[j][this.chartObj[i][0]])
                    // }//end of created if-else
                  }//end of graphdata for loop
                }//end of chartobj for loop
                // socket.syncUpdates(model, this.chartObj);
              }else{
                this.chartObj = [];
                alert("No Data Available");
              }
              
             }.bind(this));
      }else if(this.segment ==='month'){
        this.data(this.names);
        $http.get(this.url+'month',{
            params:{
              month:this.month,
              year:this.year,
              days:this.days
              }
            }).success(function(res){
              if (res.length !== 0){
                var graphData = res;
                // console.log("graphData", graphData)
                for (var i = 0;i<this.chartObj.length;i++){
                  for (var j = 0;j<graphData.length;j++){
                    // console.log("each chartObj is ",this.chartObj[i]);
                    // console.log("Graph Data for Each chartObj is ",graphData[j]);
                    // if(this.chartObj[i][0] == 'created' ){
                    //   this.chartObj[i].push($filter('date')(graphData[j]['created'], 'yyyy-MM-dd'));
                    // }else{
                      // console.log("push others here")
                       this.chartObj[i].push(graphData[j][this.chartObj[i][0]])
                    // }//end of created if-else
                  }//end of graphdata for loop
                }//end of chartobj for loop
                // socket.syncUpdates(model, this.chartObj);
              }else{
                this.chartObj = [];
                alert("No Data Available");
              }
              
             }.bind(this));
      }else{
        this.data(this.names);
        // firsth check if topic being defined
        if(this.topic == undefined){
          //get data from api    
          $http.get(this.url).success(function(res){
            var graphData = res;
            // console.log("graphData", graphData)
             
            for (var i = 0;i<this.chartObj.length;i++){
              for (var j = 0;j<graphData.length;j++){
                // console.log("each chartObj is ",this.chartObj[i]);
                // console.log("Graph Data for Each chartObj is ",graphData[j]);
                // if(this.chartObj[i][0] == 'created' ){
                //   this.chartObj[i].push($filter('date')(graphData[j]['created'], 'yyyy-MM-dd'));
                // }else{
                  // console.log("push others here")
                   this.chartObj[i].push(graphData[j][this.chartObj[i][0]])
                // }//end of created if-else
              }//end of graphdata for loop
            }//end of chartobj for loop
            // socket.syncUpdates(model, this.chartObj);
           }.bind(this));
        }else if(this.topic == 'last'){
          this.data(this.names);
          //get data from url and display table on page load
          $http.get(this.url+'last').success(function(data){
            var last_topic = data.poll_head 
            console.log("last topic in chart service is :: ", last_topic);
            $http.get(this.url+'topic',{
              params:{
                topic:last_topic
               }
              }).success(function(res){
              var graphData = res;
              console.log("graphData", graphData)
               console.log("chartObj is ",this.chartObj);
              for (var i = 0;i<this.chartObj.length;i++){
                for (var j = 0;j<graphData.length;j++){
                  // console.log("each chartObj is ",this.chartObj[i]);
                  // console.log("Graph Data for Each chartObj is ",graphData[j]);
                  if(this.chartObj[i][0] == 'created' ){
                    this.chartObj[i].push($filter('date')(graphData[j]['created'], 'yyyy-MM-dd'));
                  }else{
                    // console.log("push others here")
                     this.chartObj[i].push(graphData[j][this.chartObj[i][0]])
                  }//end of created if-else
                }//end of graphdata for loop
              }//end of chartobj for loop
            // socket.syncUpdates(model, this.chartObj);
            }.bind(this))//get topic api call end here
           }.bind(this));//get last api call ends here
        }else{
          //get data from api    
          $http.get(this.url+'topic',{
            params:{
              topic:this.topic
             }
            }).success(function(res){
            var graphData = res;
            // console.log("graphData", graphData)
             
            for (var i = 0;i<this.chartObj.length;i++){
              for (var j = 0;j<graphData.length;j++){
                // console.log("each chartObj is ",this.chartObj[i]);
                // console.log("Graph Data for Each chartObj is ",graphData[j]);
                if(this.chartObj[i][0] == 'created' ){
                  this.chartObj[i].push($filter('date')(graphData[j]['created'], 'yyyy-MM-dd'));
                }else{
                  // console.log("push others here")
                   this.chartObj[i].push(graphData[j][this.chartObj[i][0]])
                }//end of created if-else
              }//end of graphdata for loop
            }//end of chartobj for loop
            // socket.syncUpdates(model, this.chartObj);
           }.bind(this));
         }//end of topi if-else
       }
        
       
       };//end of api function
    Chart.prototype.data    = function (name) {
      // console.log("this.names",this.names)
        for (var i =0;i<name.length;i++){
          this.chartObj[i] = [name[i]]
        }
     };
    Chart.prototype.update  = function (name) {
      // console.log("update executed");
      var that = this;
      name.forEach(function(data){
        // console.log("each item name is  ", data);
         that.names.push(data);
      });
       this.data(that.names);
       this.api();
     
      // console.log("new charts names are ", that.names);
 
      // console.log("new chartObj is ", this.chartObj);
     }; 
    Chart.prototype.notify  = function (data) {
      console.log("Emiting update socket");
      socket.socket.emit('chartemit',"Emit chart update");
      }; 

    // Public API here
    return Chart;
  });
