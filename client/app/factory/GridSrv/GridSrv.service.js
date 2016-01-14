'use strict';

angular.module('poll')
  .factory('GridSrv', function (socket,$http,uiGridConstants,$interval,$q,$log,$timeout) {
    
    var Grid = function(url,column){
      this.url         = url;
      this.colDef      = column;
      this.state       = {};
      this.data        = [];
      this.firstPage   = 2;
      this.lastPage    = 0;
      this.gridOptions = {
        showGridFooter            : true,
        enableRowSelection        : true,
        enableSelectAll           : true,
        showColumnFooter          : true,
        enableFiltering           : true,
        exporterMenuCsv           : true,
        enableGridMenu            : true,
        enableSorting             : true,
        saveFocus                 : false,
        saveScroll                : true,
        infiniteScrollRowsFromEnd : 40,
        infiniteScrollUp          : true,
        infiniteScrollDown        : true,
        selectionRowHeaderWidth   : 35,
        rowHeight                 : 35,
        multiSelect               : true,
        gridMenuTitleFilter       : fakeI18n,
        data                      : 'data',
        columnDefs                : this.colDef,
        gridMenuCustomItems       : [
            {
              title: 'Rotate Grid',
              action: function ($event) {
                this.grid.element.toggleClass('rotated');
              },
              order: 210
            }
           ],
        isRowSelectable           : function (row){
          if(row.entity.taskProgress > 100){
            return false;
          } else {
            return true;
          }
         },
        importerDataAddCallback   : function ( grid, newObjects ) {
          this.data = this.data.concat( newObjects );
         },
        onRegisterApi             : function (gridApi) {
          gridApi.infiniteScroll.on.needLoadMoreData(Grid.prototype, Grid.prototype.getDataDown);
          gridApi.infiniteScroll.on.needLoadMoreDataTop(Grid.prototype, Grid.prototype.getDataUp);
          this.gridApi = gridApi;
          console.log("this.gridApi is: ", this.gridApi)
          var cellTemplate = 'ui-grid/selectionRowHeader';   // you could use your own template here
          // this.gridApi.core.addRowHeaderColumn( { name: 'rowHeaderCol', displayName: '', width: 30, cellTemplate: cellTemplate} );
          this.gridApi.core.on.sortChanged( Grid.prototype, function( grid, sort ) {
            this.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
           })
          // interval of zero just to allow the directive to have initialized
          $interval( function() {
            gridApi.core.addToGridMenu( gridApi.grid, [{ title: 'Dynamic item', order: 100}]);
           }, 0, 1);
          gridApi.core.on.columnVisibilityChanged( Grid.prototype, function( changedColumn ){
            Grid.prototype.columnChanged = { field: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
           });
          gridApi.selection.on.rowSelectionChanged(Grid.prototype,function(row){
            var msg = 'row selected ' + row.isSelected;
            $log.log(msg);
           });
          gridApi.selection.on.rowSelectionChangedBatch(Grid.prototype,function(rows){
            var msg = 'rows changed ' + rows.length;
            $log.log(msg);
           });
         }
        };

      this.getFirstData().then(function(){
        $timeout(function() {
          // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
          // you need to call resetData once you've loaded your data if you want to enable scroll up,
          // it adjusts the scroll position down one pixel so that we can generate scroll up events 
          console.log("Inside getFirstData timeout function scope.gridApi is :" ,this.gridApi)
          this.gridApi.infiniteScroll.resetScroll( this.firstPage > 0, this.lastPage < 4 );
        });
      });     
      console.log("Grid initialized with names: ");
    }; 

 

  var fakeI18n           = function ( title ){
      var deferred           = $q.defer();
        $interval( function() {
          deferred.resolve( 'col: ' + title );
        }, 1000, 1);
        return deferred.promise;
     };
  Grid.prototype.remove           = function () {
      this.gridOptions.columnDefs.splice(this.gridOptions.columnDefs.length-1, 1);
     }   
  Grid.prototype.add              = function () {
      this.gridOptions.columnDefs.push({ field:'goalName', enableSorting: false });
     }
  Grid.prototype.splice           = function () {
      this.gridOptions.columnDefs.splice(1, 0, { field: 'company', enableSorting: false });
     }
  Grid.prototype.unsplice         = function () {
      this.gridOptions.columnDefs.splice(1, 1);
     }

     //UI-GRID Implementation
  Grid.prototype.saveState        = function () {
      this.state = this.gridApi.saveState.save();
     };
  Grid.prototype.restoreState     = function () {
      this.gridApi.saveState.restore( Grid.prototype, Grid.prototype.state );
     };
  Grid.prototype.expandAll        = function (){
      this.gridApi.grouping.expandAllRows();
     };
  Grid.prototype.toggleRow        = function ( rowNum ){
      this.gridApi.grouping.toggleRowGroupingState(this.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
     }; 
  Grid.prototype.changeGrouping   = function () {
      this.gridApi.grouping.clearGrouping();
      this.gridApi.grouping.groupColumn('age');
      this.gridApi.grouping.aggregateColumn('state', uiGridGroupingConstants.aggregation.COUNT);
     };
  Grid.prototype.getAggregates    = function () {
      var aggregateInfo = {};
      var lastState; 
      this.gridApi.grid.renderContainers.body.visibleRowCache.forEach( function(row) {
        if( row.groupHeader ) {
          if( row.groupLevel === 0 ){
            // in the format "xxxxx (10)", we want the xxxx and the 10
            if( match = row.entity.state.match(/(.+) \((\d+)\)/) ){
              aggregateInfo[ match[1] ] = { stateTotal: match[2] };
              lastState = match[1];
            }
          } else if (row.groupLevel === 1){
            if( match = row.entity.gender.match(/(.+) \((\d+)\)/) ){
              aggregateInfo[ lastState ][ match[1] ] = match[2];
            }
          }
        }
      });
      console.log(aggregateInfo);
     };
  Grid.prototype.scrollTo         = function ( rowIndex, colIndex ) {
      console.log("This is this.gridApi now ",  this.gridApi.core)
      this.gridApi.core.scrollTo( this.gridOptions.data[rowIndex], this.gridOptions.columnDefs[colIndex]);
     }; 

    //Infinite Scroll 
  Grid.prototype.getFirstData     = function () {
      var promise = $q.defer();
      $http.get(this.url)
      .success(function(data) {
        // console.log("data is ", data)
        var newData = this.getPage(data, this.lastPage);
        this.data = this.data.concat(newData);
        // console.log("this.data is :",  this.data)
        promise.resolve();
      });
      return promise.promise;
     };
  Grid.prototype.getDataDown      = function () {
      var promise = $q.defer();
      $http.get(this.url)
      .success(function(data) {
        this.lastPage++;
        var newData = this.getPage(data, this.lastPage);
        this.gridApi.infiniteScroll.saveScrollPercentage();
        console.log("inside getDataDown this.gridApi is :",this.gridApi.infiniteScroll.dataLoaded(this.firstPage > 0, this.lastPage < 4))
        this.data = this.data.concat(newData);
        this.gridApi.infiniteScroll.dataLoaded(this.firstPage > 0, this.lastPage < 4)
        .then(function() {this.checkDataLength('up');})
        .then(function() {
          promise.resolve();
        });
      })
      .error(function(error) {
        this.gridApi.infiniteScroll.dataLoaded();
        promise.reject();
      });
      return promise.promise;
     };
  Grid.prototype.getDataUp        = function () {
      var promise = $q.defer();
      $http.get(this.url)
      .success(function(data) {
        this.firstPage--;
        var newData = this.getPage(data, this.firstPage);
        this.gridApi.infiniteScroll.saveScrollPercentage();
        this.data = newData.concat(this.data);
        this.gridApi.infiniteScroll.dataLoaded(this.firstPage > 0, this.lastPage < 4).then(function() {this.checkDataLength('down');}).then(function() {
          promise.resolve();
        });
      })
      .error(function(error) {
        this.gridApi.infiniteScroll.dataLoaded();
        promise.reject();
      });
      return promise.promise;
     };
  Grid.prototype.getPage          = function (data, page) {
      // console.log("data inside getPage is ", data)
      var res = [];
      for (var i = (page * 100); i < (page + 1) * 100  && i < data.length; ++i) {
        // console.log("data[i] is : ", data[i]);
        res.push(data[i]);
      }
      // console.log("res is : " , res)
      return res;
     };
  Grid.prototype.checkDataLength  = function ( discardDirection) {
      // work out whether we need to discard a page, if so discard from the direction passed in
      if( this.lastPage - this.firstPage > 3 ){
        // we want to remove a page
        this.gridApi.infiniteScroll.saveScrollPercentage();
        
        if( discardDirection === 'up' ){
          this.data = this.data.slice(100);
          this.firstPage++;
          $timeout(function() {
            // wait for grid to ingest data changes
            this.gridApi.infiniteScroll.dataRemovedTop(this.firstPage > 0, this.lastPage < 4);
          });
        } else {
          this.data = this.data.slice(0, 400);
          this.lastPage--;
          console.log("this.lastPage in checkDataLength :" , this.lastPage)
          $timeout(function() {
            // wait for grid to ingest data changes
            this.gridApi.infiniteScroll.dataRemovedBottom(this.firstPage > 0, this.lastPage < 4);
          });
        }
      }
     };
  Grid.prototype.reset            = function () {
      this.firstPage = 2;
      this.lastPage = 2;
      
      // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
      this.gridApi.infiniteScroll.setScrollDirections( false, false );
      this.data = [];
   
      this.getFirstData().then(function(){
        $timeout(function() {
          // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
          this.gridApi.infiniteScroll.resetScroll( this.firstPage > 0, this.lastPage < 4 );
        });
      });
     };

    // Public API here
    return Grid;
  });
