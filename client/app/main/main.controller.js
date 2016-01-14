// 'use strict';

angular.module('poll')
  .controller('MainCtrl', function ($scope) {
    
  // @@@@@@@@@@@@@@@@@@@ DATA SOURCES and Models @@@@@@@@@@@@@@@@@@@@@@@
  	
    //################# Chart directive implementation #################
  	$scope.chart      = {
      url        :'/api/polls/', 
      model      :'poll',
      base       :'item',
      type       :'bar',
      topic      :'true',  
      axistype   :'category', 
      columndata :['item','ratings'],
      updateData :[]
     };
    //################# Chart directive implementation #################


    // ################# MODAL DEPLOYMENT ################# 
    
    //modal top height adjustment
    $scope.top ='420px';
   
    //modal controller 
    $scope.modalShown    = false;
    $scope.dynamic_forms = {};
    
    //modal methods

    $scope.addPoll          = function () {
      $scope.modalShown = !$scope.modalShown;
      $scope.dynamic_forms = $scope.poll_data;
      console.log("scope.dynamic_forms is:: ", $scope.dynamic_forms)
      // alert("Food Modal")
     }; 
    //pass functions to modal
    $scope.close_directive_modal = function () {
      $scope.modalShown    = false;
      console.log("I am from checkout directive and I have been executed")
     };  

    // ################# MODAL DEPLOYMENT ################# 


    //################# poll directive implementation #################
    //add forms content
    // for poll purpose if add forms being used, first name has to be decleared as 'poll_head' and second one 'item'
    $scope.poll_data = {
      fields:[ 
              {'name':'poll_head','header':'Topic','type':'text','title':'Topic'},
              {'name':'item','header':'Item','type':'text'}
              ],
      url:'/api/polls/',
      catUrl:'/api/categorys/',
      voteUrl:'/api/votes/',
      model:"poll",
      array:'item'
     };
    //################# poll directive implementation #################

  });

  

