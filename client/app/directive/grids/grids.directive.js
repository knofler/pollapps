'use strict';

angular.module('poll')
  .directive('grids', function (socket,$http,uiGridConstants,$interval,$q,$log,$timeout) {
    return {
      templateUrl: 'app/directive/grids/grids.html',
      restrict: 'EA',
      scope:{
      	url:'=',
        model:'=',
      	columnDef : '='
      },
      link: function (scope, element, attrs) {
      	
        scope.state      = {};
        scope.data       = [];
        scope.firstPage  = 2;
        scope.lastPage   = 0;
        scope.msg        = {};

        scope.gridOptions = {
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
          columnDefs                : scope.columnDef,
          gridMenuCustomItems     : [
              {
                title: 'Rotate Grid',
                action: function ($event) {
                  this.grid.element.toggleClass('rotated');
                },
                order: 210
              }
             ],
          isRowSelectable         : function (row){
            if(row.entity.taskProgress > 100){
              return false;
            } else {
              return true;
            }
           },
          importerDataAddCallback : function ( grid, newObjects ) {
            scope.data = scope.data.concat( newObjects );
           },
          onRegisterApi           : function (gridApi) {
            gridApi.infiniteScroll.on.needLoadMoreData(scope, scope.getDataDown);
            gridApi.infiniteScroll.on.needLoadMoreDataTop(scope, scope.getDataUp);
            scope.gridApi = gridApi;
            console.log("scope.gridApi is: ", scope.gridApi)
            var cellTemplate = 'ui-grid/selectionRowHeader';   // you could use your own template here
            // scope.gridApi.core.addRowHeaderColumn( { name: 'rowHeaderCol', displayName: '', width: 30, cellTemplate: cellTemplate} );
            scope.gridApi.core.on.sortChanged( scope, function( grid, sort ) {
              scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
             })
            // interval of zero just to allow the directive to have initialized
            $interval( function() {
              gridApi.core.addToGridMenu( gridApi.grid, [{ title: 'Dynamic item', order: 100}]);
             }, 0, 1);
            gridApi.core.on.columnVisibilityChanged( scope, function( changedColumn ){
              scope.columnChanged = { field: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
             });
            gridApi.selection.on.rowSelectionChanged(scope,function(row){
              var msg = 'row selected ' + row.isSelected;
              $log.log(msg);
             });
            gridApi.selection.on.rowSelectionChangedBatch(scope,function(rows){
              var msg = 'rows changed ' + rows.length;
              $log.log(msg);
             });
            gridApi.edit.on.afterCellEdit(scope,function(rowEntity, colDef, newValue, oldValue){
              console.log("colDef is ", colDef.name);
              var update_data = {};
                update_data[colDef.name] = newValue;
              scope.msg.lastCellEdited = 'Edited row id: ' + rowEntity._id + ' Column: ' + colDef.name + ' NewValue: ' + newValue + ' OldValue: ' + oldValue ;
              var update_url = scope.url+rowEntity._id;
              $http.put(update_url,update_data);
              scope.$apply();
             });
           }
         };

        var fakeI18n           = function ( title ){
          var deferred = $q.defer();
            $interval( function() {
              deferred.resolve( 'col: ' + title );
            }, 1000, 1);
            return deferred.promise;
          };
        scope.remove           = function () {
          scope.gridOptions.columnDefs.splice(scope.gridOptions.columnDefs.length-1, 1);
         }   
        scope.add              = function () {
          scope.gridOptions.columnDefs.push({ field:'goalName', enableSorting: false });
         }
        scope.splice           = function () {
          scope.gridOptions.columnDefs.splice(1, 0, { field: 'company', enableSorting: false });
         }
        scope.unsplice         = function () {
          scope.gridOptions.columnDefs.splice(1, 1);
         }

           //UI-GRID Implementation
        scope.saveState        = function () {
          scope.state = scope.gridApi.saveState.save();
         };
        scope.restoreState     = function () {
          scope.gridApi.saveState.restore( scope, scope.state );
         };
        scope.expandAll        = function (){
          scope.gridApi.grouping.expandAllRows();
         };
        scope.toggleRow        = function ( rowNum ){
          scope.gridApi.grouping.toggleRowGroupingState(scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
         }; 
        scope.changeGrouping   = function () {
          scope.gridApi.grouping.clearGrouping();
          scope.gridApi.grouping.groupColumn('age');
          scope.gridApi.grouping.aggregateColumn('state', uiGridGroupingConstants.aggregation.COUNT);
         };
        scope.getAggregates    = function () {
          var aggregateInfo = {};
          var lastState; 
          scope.gridApi.grid.renderContainers.body.visibleRowCache.forEach( function(row) {
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
        scope.scrollTo         = function ( rowIndex, colIndex ) {
          console.log("This is scope.gridApi now ",  scope.gridApi.core)
          scope.gridApi.core.scrollTo( scope.gridOptions.data[rowIndex], scope.gridOptions.columnDefs[colIndex]);
         }; 

        //Infinite Scroll 
        scope.getFirstData     = function () {
          var promise = $q.defer();
          
          $http.get(scope.url)
          .success(function(data) {
            // console.log("data is ", data)
            var newData = scope.getPage(data, scope.lastPage);
            scope.data = scope.data.concat(newData);
            socket.syncUpdates(scope.model, scope.data);
            // console.log("scope.data is :",  scope.data)
            promise.resolve();
          });
          return promise.promise;
         };
        scope.getDataDown      = function () {
          var promise = $q.defer();
          $http.get(scope.url)
          .success(function(data) {
            scope.lastPage++;
            var newData = scope.getPage(data, scope.lastPage);
            scope.gridApi.infiniteScroll.saveScrollPercentage();
            console.log("inside getDataDown scope.gridApi is :",scope.gridApi.infiniteScroll.dataLoaded(scope.firstPage > 0, scope.lastPage < 4))
            scope.data = scope.data.concat(newData);
            scope.gridApi.infiniteScroll.dataLoaded(scope.firstPage > 0, scope.lastPage < 4)
            .then(function() {scope.checkDataLength('up');})
            .then(function() {
              promise.resolve();
            });
          })
          .error(function(error) {
            scope.gridApi.infiniteScroll.dataLoaded();
            promise.reject();
          });
          return promise.promise;
         };
        scope.getDataUp        = function () {
          var promise = $q.defer();
          $http.get(scope.url)
          .success(function(data) {
            scope.firstPage--;
            var newData = scope.getPage(data, scope.firstPage);
            scope.gridApi.infiniteScroll.saveScrollPercentage();
            scope.data = newData.concat(scope.data);
            scope.gridApi.infiniteScroll.dataLoaded(scope.firstPage > 0, scope.lastPage < 4).then(function() {scope.checkDataLength('down');}).then(function() {
              promise.resolve();
            });
          })
          .error(function(error) {
            scope.gridApi.infiniteScroll.dataLoaded();
            promise.reject();
          });
          return promise.promise;
         };
        scope.getPage          = function (data, page) {
          // console.log("data inside getPage is ", data)
          var res = [];
          for (var i = (page * 100); i < (page + 1) * 100  && i < data.length; ++i) {
            // console.log("data[i] is : ", data[i]);
            res.push(data[i]);
          }
          // console.log("res is : " , res)
          return res;
         };
        scope.checkDataLength  = function ( discardDirection) {
          // work out whether we need to discard a page, if so discard from the direction passed in
          if( scope.lastPage - scope.firstPage > 3 ){
            // we want to remove a page
            scope.gridApi.infiniteScroll.saveScrollPercentage();
            
            if( discardDirection === 'up' ){
              scope.data = scope.data.slice(100);
              scope.firstPage++;
              $timeout(function() {
                // wait for grid to ingest data changes
                scope.gridApi.infiniteScroll.dataRemovedTop(scope.firstPage > 0, scope.lastPage < 4);
              });
            } else {
              scope.data = scope.data.slice(0, 400);
              scope.lastPage--;
              console.log("scope.lastPage in checkDataLength :" , scope.lastPage)
              $timeout(function() {
                // wait for grid to ingest data changes
                scope.gridApi.infiniteScroll.dataRemovedBottom(scope.firstPage > 0, scope.lastPage < 4);
              });
            }
          }
         };
        scope.reset            = function () {
          scope.firstPage = 2;
          scope.lastPage = 2;
          
          // turn off the infinite scroll handling up and down - hopefully this won't be needed after @swalters scrolling changes
          scope.gridApi.infiniteScroll.setScrollDirections( false, false );
          scope.data = [];
       
          scope.getFirstData().then(function(){
            $timeout(function() {
              // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
              scope.gridApi.infiniteScroll.resetScroll( scope.firstPage > 0, scope.lastPage < 4 );
            });
          });
         };

        scope.getFirstData().then(function(){
          $timeout(function() {
            // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
            // you need to call resetData once you've loaded your data if you want to enable scroll up,
            // it adjusts the scroll position down one pixel so that we can generate scroll up events 
            console.log("Inside getFirstData timeout function scope.gridApi is :" ,scope.gridApi)
            scope.gridApi.infiniteScroll.resetScroll( scope.firstPage > 0, scope.lastPage < 4 );
          });
         });
            }
          };
  });