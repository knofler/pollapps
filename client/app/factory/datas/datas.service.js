'use strict';

angular.module('poll')
  .factory('datas', function ($http,$filter,socket,$timeout) {
    
    var Data = function (url,targetDiv,addColumn,addColHead,colHead) {
       
        this.url        = url;
        this.targetDiv  = targetDiv;
        this.colHead    = colHead;
        this.addColumn  = addColumn;
        this.addColHead = addColHead;
        console.log("Data initialized with url: ",this.url , "targetDiv: " ,
         this.targetDiv, 'addColumn: ', this.addColumn," addColHead: ",this.addColHead, "colHead: ", this.colHead );
        // this.addColumn(this.url)
        this.tableDisplay(this.addColumn,this.addColHead,this.targetDiv,this.colHead);

       } ;
    
    Data.prototype.csvdata    = [];
    if (!d3.chart) d3.chart = {};

    Data.prototype.isCsv        = function (url) {
      var ext = url.substr(url.length - 3)
      console.log ("url before split ext is :: ", ext);
      // var ext = url.split('.').pop();
      console.log("url ",url);
      console.log("ext ",ext);
      if(ext == 'csv'){
        return true;
      }else{
        return false;
      }
     };    
    d3.chart.table              = function (addColumn,addColHead) {
      var data,headdata,width,div;
      var dispatch = d3.dispatch(chart,"hover");
      //reusable chart pattern
      function chart (container){
        //initialization code
        div = container;
        //append dynamic table with responsive bootstrap into container div 
        var table = container.append("table").classed("table table-bordred table-striped",true);
        
        // append thead to table
        var thead = table.append('thead');
        //selectAll th with data to thead element, use selectAll as this are dynamic entries and non exisyent till now.
        var th = thead.selectAll("th").data(headdata);
        //create all dynamic th with enter() command
        var thEnter = th.enter();
        //Create columns with cell data in each row --column-1
        addColHead(thEnter);
        //exit() method to adjust automatic row removal
        // th.exit().remove();

        //append tbody to table
        var tbody = table.append('tbody');
        //selectAll rows with with data to tbody element, use selectAll as this are dynamic entries and non exisyent till now.
        var rows = tbody.selectAll("tr").data(data);
        

        //create all dynamic rows with enter() command
        var rowsEnter = rows.enter()
        .append("tr");
        //Create columns with cell data in each row --column-1
        addColumn(rowsEnter);
        //exit() method to adjust automatic row removal
        rows.exit().remove();

        rowsEnter.on("mouseover",function(d){
          d3.select(this).style("background-color","orange");
          dispatch.hover([d]);
          });
        rowsEnter.on("mouseout",function(d){
          d3.select(this).style("background-color","")
          dispatch.hover([]);
          });
       };

      chart.highlight = function (data){
        var trs = div.selectAll("tr")
        .style("background-color","");
        
        trs.data(data,function(d){return d.data.id})
        .style("background-color","grey")

        };
      chart.data      = function (value){
        if(!arguments.length) return data;
        data = value;
        // console.log("chart.table got data : ", data)
        return chart;
       };
      chart.head      = function (colHead){
        // console.log("head being executed")
         if(!arguments.length) return headdata;
          headdata = colHead;
          console.log("head is ",headdata)
          return chart;
       };
      //width function 
      chart.width     = function (value){
        if(!arguments.length) return width;
        width = value;
        return chart;
       };
       //return chart function as the condition of reusable chart pattern
      // return chart;
      return d3.rebind(chart,dispatch,"on");
     };   
    Data.prototype.tableDisplay = function (addColumn,addColHead,targetdiv,colHead){
      // console.log("colHead from directive  is : ", colHead);
      // console.log("url is : ", this.url);
      // var ext = this.url.split(".")[1];
      // console.log("ext is : ",  ext )

      var data  = [];  
      if (this.url===undefined){
        return
      }else{
        if(this.isCsv(this.url)){
          d3.csv(this.url,function(err,payload){
            // console.log("csv payload is ", payload);
            data = payload;
            Data.prototype.csvdata = payload;
            if(colHead.length == 0){
               var firstrow= data[0];
               for(var key in firstrow){
                colHead.push(key)
               } 
            }
           
            // console.log("data == ", data)
          })
        }else{
          d3.json(this.url,function(err,payload){
            // console.log("csv payload is ", payload);
            data = payload;
            Data.prototype.csvdata = payload;
            if(colHead.length == 0){
               var firstrow= data[0];
               for(var key in firstrow){
                colHead.push(key)
               } 
            }
           
            // console.log("data == ", data)
          })
        }
        
      }
           
         setTimeout(function(){
          //build table using d3.chart.table function
          //parent Div where table will be inserted
          // console.log("targetdiv is :", targetdiv)
          var display = d3.select(targetdiv);
          // console.log("display is : ", display)
          //table container
          var tdiv = display.append("div").classed("table-responsive customTable",true);
          // console.log("tdiv : ",  tdiv)
          //instantiate chart function
          // console.log("addColumn is ", addColumn)
          var table = d3.chart.table(addColumn,addColHead);
          // console.log("table is :", table)
          // console.log("colHead is" ,colHead)
          //set Data to table
          table.data(data);
          table.head(colHead);
          //render table
          table(tdiv);
          // this.table.on("hover",function(hovered){
          //   // console.log(hovered)
          //   this.scatter.highlight(hovered);
          // });   
         },2000)
       };
    
      
    // Public API here
    return Data;
  

  });
