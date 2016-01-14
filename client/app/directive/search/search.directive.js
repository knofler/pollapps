'use strict';

angular.module('poll')
  .directive('search', function (Display,Auth) {
    return {
      templateUrl: 'app/directive/search/search.html',
      scope:{
      	data:'=',
      	filtermodel:'=',
      	found:'='
      },
      restrict: 'EA',
      link: function (scope, element, attrs) {

      	//get user info
  		scope.getCurrentUser = Auth.getCurrentUser;

        //pagination parameters  
	  	scope.totalList   = false;
	  	scope.searchBox   = false;
	  	scope.totalItems  = '';
	  	scope.currentPage = 1;
	  	scope.maxSize     = 10; //pagination max size is 10

	  	//search pagination
  		scope.searchItems    = '';

  		//run this directive local calculate function to reinitialize Display class as data changes
	    scope.calculate          = function () {
	        // console.log("element passed on was :: ", element);
	        // console.log("attrs passed on was :: ", attrs);
	        // console.log("innerHTML passed on was :: ", element[0].children); 
	        var test = new Display();
	        // console.log("test is ::: ", test) 
	          // console.log("test.test() is ::: ", test.test()); 
	            $('#pinBoot').pinterest_grid({
	                no_columns: 4,
	                padding_x: 10,
	                padding_y: 15,
	                margin_bottom: 55,
	                single_column_breakpoint: 701
	               });
	       };

  		//search pagination event
	  	$(document).on('keyup','#input-search',function(){
	  	  //recalculate as display changes
	  	  scope.calculate();
	      
	      scope.searchPag=true;
	      scope.searchflip = true;
	      $('#searchPag').show();
	      $('#searchflip').show();
	      var searchField = $('#input-search').val();
	        if(searchField == ''){
	          scope.searchPag=false;
	          scope.searchflip = false;
	          $('#searchPag').hide();
	          $('#searchflip').hide();
	        }      
	     });

		//pagination and page control functions
		scope.setTotalItems = function(){
		  scope.totalItems = scope.payload.length;
		 };

      	// console.log("data passed is : ", scope.data);

      }
    };
  });