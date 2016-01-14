'use strict';

angular.module('poll')
.controller('SettingsCtrl', function ($scope,User,userInfo,pageCtrlSrv,Auth,$timeout) {
  //pagination parameters  
  $scope.totalUserList    = false;
  $scope.totalGroupList   = false;
  $scope.searchUserBox    = false;
  $scope.searchGroupBox   = false;
  $scope.totalUsers       = '';
  $scope.totalGroups      = '';
  $scope.currentUserPage  = 1;
  $scope.currentGroupPage = 1;
  $scope.pageSize         = 8;
  $scope.maxSize          = 10; //pagination max size is 10

  //Get resource name from the path variable
  var route       = window.location.pathname;
  $scope.resource = route.slice(1,route.length);


  //userInfo service call
  userInfo.user_array();
  userInfo.group_array();
  userInfo.role_array(); 
  
  //pageCtrlSrv service call

  //search pagination
  $scope.searchUsers    = '';
  $scope.searchGroups   = '';
  
  //get user info
  $scope.getCurrentUser = Auth.getCurrentUser;
  // $scope.hasReadAccess($scope.resource,$scope.getCurrentUser().email)

  //ADD MQ USERs with modal and forms directive
  $scope.mquser_forms      = {
      fields  : [ {'name':'OneID','type':'input'},
                {'name':'JobStartDate','type':'date'},
                {'name':'Email','type':'email'},
                {'name':'JobEndDate','type':'date'},
                {'name':'FirstName','type':'input'},
                {'name':'JobTitle','type':'input'},
                {'name':'LastName','type':'input'},
                {'name':'OfficeLocation','type':'input'},
                {'name':'PhoneNumber','type':'input'}
                ],
      url     : '/api/mqusers/',
      model   : 'mquser'
     };                      
  $scope.modalShown        = false;
  $scope.dynamic_forms     = {};
  $scope.add_mquser_modal  = function () {
      $scope.modalShown    = !$scope.modalShown;
      $scope.dynamic_forms = $scope.mquser_forms;
      // alert("Food Modal")
     };

  //search pagination event
  $(document).on('keyup','#input_search',function(){
      // $("#userPermSuccess").hide();  
      $scope.searchUserPag=true;
      $scope.searchUserflip = true;
      $('#searchUserPag').show();
      $('#searchUserflip').show();
      var searchField = $('#input_search').val();
        if(searchField == ''){
          $scope.searchUserPag=false;
          $scope.searchUserflip = false;
          $('#searchUserPag').hide();
          $('#searchUserflip').hide();
        }      
     });
  $(document).on('keyup','#input_search_group',function(){
    // $("#groupPermSuccess").hide(); 
      $scope.searchGroupPag  = true;
      $scope.searchGroupflip = true;
      $('#searchGroupPag').show();
      $('#searchGroupflip').show();
      var searchField = $('#input_search_group').val();
        if(searchField == ''){
          $scope.searchGroupPag  = false;
          $scope.searchGroupflip = false;
          $('#searchGroupPag').hide();
          $('#searchGroupflip').hide();
        }      
     });

  //toolbar status events
  $(document).on("change","#checkallUser",function(){
     // console.log(getUsers); //check all when this class selected
      $(".checkthisUser").prop('checked',this.checked);
      //show toolbar when cheked
        $("#toolbarUser").fadeIn("slow")
      //hide toolbar when none selected  
        if(!this.checked){
          $("#toolbarUser").fadeOut("slow");
        }
     });
  $(document).on("change",".checkthisUser",function(e){      
    //show toolbar when any one of them checked 
    $("#toolbarUser").fadeIn("slow");

    //hide when nothing checked
    if(!$("input:checked").is(":checked")){
      // alert("Not checked");
        $("#toolbarUser").fadeOut("slow");
     }
        });
  $(document).on("change","#checkallGroup",function(){
     // console.log(getUsers); //check all when this class selected
      $(".checkthisGroup").prop('checked',this.checked);
      //show toolbar when cheked
        $("#toolbarGroup").fadeIn("slow")
      //hide toolbar when none selected  
        if(!this.checked){
          $("#toolbarGroup").fadeOut("slow");
        }
     });
  $(document).on("change",".checkthisGroup",function(e){      
    //show toolbar when any one of them checked 
    $("#toolbarGroup").fadeIn("slow");

    //hide when nothing checked
    if(!$("input:checked").is(":checked")){
      // alert("Not checked");
        $("#toolbarGroup").fadeOut("slow");
     }
        });

  //pageCtrlSrv function available for application controller
   $scope.popAdd    = pageCtrlSrv.popAdd;
   $scope.popDelete = pageCtrlSrv.popDelete;
   $scope.popEdit   = pageCtrlSrv.popEdit;
   $scope.popAssign = pageCtrlSrv.popAssign;
   $scope.showData  = pageCtrlSrv.showData;

  //userInfo function available for application controller
  // $scope.readAccess = userInfo.hasReadAccess;
  

    //pagination and page control functions
    $scope.setTotalUsers  = function(){
      $scope.totalUsers = $scope.userRepo.length;
     };
    $scope.setTotalGroups = function(){
      $scope.totalGroups = $scope.groupRepo.length;
     };
    $scope.showAllUser    = function(){
      $scope.searchUsers    = ''; 
      $scope.totalUserList  = true;
      $scope.searchUserBox  = true;
      $('#searchUserPag').hide();
       $('#searchUserflip').hide();
     };
    $scope.showAllGroup   = function(){
      $scope.searchGroups     = ''; 
      $scope.totalGroupList   = true;
      $scope.searchGroupBox   = true;
      $('#searchGroupPag').hide();
       $('#searchGroupflip').hide();
     }; 
    $scope.searchUser     = function(){
     $scope.currentUserPage  = 1;
      $scope.pageSize        = 8;
      $scope.totalUserList   = false;
      $scope.searchUserBox   = false;
      $('input:checkbox').removeAttr('checked');
     };
    $scope.searchGroup    = function(){
     $scope.currentGroupPage  = 1;
      $scope.pageSize         = 8;
      $scope.totalGroupList   = false;
      $scope.searchGroupBox   = false;
      $('input:checkbox').removeAttr('checked');
     };
    $scope.filterUser     = function(){
      $timeout(function() { 
        //wait for 'filtered' to be changed
        /* change pagination with $scope.filtered */
        $scope.searchTotalUsers  = $scope.filteredUsers.length;
        $scope.totalUsers   = Math.ceil($scope.filteredUsers.length/$scope.pageSize);
       }, 10);
      };
    $scope.filterGroup    = function(){
      $timeout(function() { 
        //wait for 'filtered' to be changed
        /* change pagination with $scope.filtered */
        $scope.searchTotalGroups = $scope.filteredGroup.length;
        $scope.totalGroups  = Math.ceil($scope.filteredGroup.length/$scope.pageSize);
       }, 10);
      };

  })
.controller('ModalgroupsAddInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  $scope.formData       = {};
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.createGroup = function () {
    var resource = $scope.formData.resource;
      $http.post('/api/groups/',{
        name:$scope.formData.groupName,
        desc:$scope.formData.groupDesc,
        resource:$scope.formData.resource,
        created: new Date(),
        created_by:$scope.getCurrentUser()._id   
    });     

      // console.log("Application : " + $scope.formData.appsName + " created at " + new Date() + " by " + $scope.getCurrentUser().name);
      
      // **************Notification*********************
      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' added new group ' + $scope.formData.groupName  ;
      // console.log(data);  

      // Send notification broadcast to all connected users
      pageCtrlSrv.send_notification(data);
      $modalInstance.close();
     
      };
  $scope.ok     = function () {
    $modalInstance.close();
   };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModalcategorysAddInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  $scope.formData       = {};
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.addCategory    = function () {      
      $http.post('/api/categorys/',{
          catName:$scope.formData.catName,
          catOption:$scope.formData.catOption,
          created: new Date(),
          created_by:$scope.getCurrentUser()._id   
         });
      // console.log("Application : " + $scope.formData.appsName + " created at " + new Date() + " by " + $scope.getCurrentUser().name);
      
      // **************Notification*********************
      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' added new option ' + $scope.formData.catOption + ' in ' 
      + $scope.formData.catName  ;

      // Send notification broadcast to all connected users
      pageCtrlSrv.send_notification(data);
         $scope.formData       = {};
        $modalInstance.close();
      };
  $scope.ok             = function () {
    $modalInstance.close();
   };
  $scope.cancel         = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModalcategorysDeleteInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  $scope.formData       = {};
  $scope.getCurrentUser = Auth.getCurrentUser;
  $scope.subcategoryArr = "";

  $scope.getOptions      = function(catName){
    // alert(option);
    $http.get('/api/categorys/category/'+catName).success(function(getOptions){
      $scope.subcategoryArr = getOptions;
      console.log(getOptions);
    })
   };
  $scope.deleteCategory  = function () {   
  console.log($scope.formData.catOption);

   $http.delete('/api/categorys/'+$scope.formData.catOption).success(function(){
      
    // **************Notification*********************
    // console.log("Application : " + $scope.appDeleteData[$scope.appDeleteData.length -1].AppsName + " deleted at " + new Date() + " by " + $scope.getCurrentUser().name);
    var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' deleted category item from ' +
     $scope.formData.catName ;
    // console.log(data);  
     // Send notification broadcast to all connected users
    pageCtrlSrv.send_notification(data);
    });
   // $scope.formData       = {};    
    $modalInstance.close();
      };
  $scope.ok              = function () {
    $modalInstance.close();
   };
  $scope.cancel          = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModalrolesAddInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  $scope.formData       = {};
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.addRole   = function () {      
      $http.post('/api/roles/',{
          roleName:$scope.formData.roleName,
          created: new Date(),
          created_by:$scope.getCurrentUser()._id   
         });
      // console.log("Application : " + $scope.formData.appsName + " created at " + new Date() + " by " + $scope.getCurrentUser().name);
      
      // **************Notification*********************
      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' added new role ' + $scope.formData.roleName ;
      // Send notification broadcast to all connected users
      pageCtrlSrv.send_notification(data);
         $scope.formData       = {};
        $modalInstance.close();
      };
  $scope.ok             = function () {
    $modalInstance.close();
   };
  $scope.cancel         = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModalaclsAddInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  $scope.accessformData = {};
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.addToGroup     = function () {  
     //get group resources
       var resource = [];
       var groupName = $scope.accessformData.group;

      //Get groups info 
      $http.get('/api/groups/name/'+groupName).success(function(getRes){   
        // console.log('getRes',getRes);
          var res = getRes[0].resource.split(","); 
          resource = res;
          // console.log("resource",resource);
        }); 

      //on each checked item run following function  
      $("input:checked").each(function(){
        var select_id = this.id;
        var email = ''
        $http.get('/api/users/user/'+select_id).success(function(getUser){
          // console.log('getUser',getUser.email);
          resource.forEach(function(eachRes){ 
            $http.get('/api/acls/rights/',{
              params:{
              resource:eachRes,
              email:getUser.email
              }
             }).success(function(getRights){
              // console.log("getRights from this pull", getRights);
              if(getRights.length == 0){
                email = getUser.email;
                setTimeout(function(){
                  //add to group table
                  $http.post('/api/acls/',{
                      email:email,
                      group:groupName,
                      resource:eachRes,
                      rights:$scope.accessformData.permission,
                      created: new Date(),
                      created_by:$scope.getCurrentUser()._id   
                    });     
                    $("#userPermSuccess").show().delay(7500).fadeOut("slow");  
                  },2500);
               }
              else{
                console.log("same permission found, update now");
                // if(getRights[0].rights === "Read" || getRights[0].rights === "Write"){
                  setTimeout(function(){
                     getRights.forEach(function(acl_id){
                       $http.put('/api/acls/'+acl_id._id,{
                        group:groupName,
                        rights:$scope.accessformData.permission,
                        edited: new Date(),
                        edited_by:$scope.getCurrentUser()._id   
                       });      
                     });    
                      $("#userPermSuccess").show().delay(7500).fadeOut("slow"); 
                      },3000);
                 // } 
               } 
             });    
           });
         });
       });   
      
      // console.log("Application : " + $scope.formData.appsName + " created at " + new Date() + " by " + $scope.getCurrentUser().name);
      
      // **************Notification*********************
      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' assinged ' + $scope.accessformData.group + ' group access to route'  ;

      // Send notification broadcast to all connected users
      pageCtrlSrv.send_notification(data);
          $modalInstance.close();
      };
  $scope.ok             = function () {
    $modalInstance.close();
   };
  $scope.cancel         = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModalaclsGroupAddInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  $scope.accessformData = {};
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.addusersToGroup     = function () {  
     //get group resources
      var resource = [];
      var email = [];
      var userName = $scope.accessformData.user;
      userName.forEach(function(user){
        $http.get("/api/users/username/"+user).success(function(getUser){
           // console.log("did I get each email: " , getUser[0].email);
           email.push(getUser[0].email);
           });
       });
        //on each checked item run following function  
        $("input:checked").each(function(){
          var select_id = this.id;
          console.log(select_id);
          $http.get('/api/groups/'+select_id).success(function(getGroup){
          //Get groups info 
          console.log("group picked is : ", getGroup);
          var groupName = getGroup.name;
                var res = getGroup.resource.split(","); 
                resource = res;
                console.log("resource",resource);
          setTimeout(function(){
             resource.forEach(function(eachRes){ 
              email.forEach(function(eachEmail){
                $http.get('/api/acls/rights/',{
                  params:{
                  resource:eachRes,
                  email:eachEmail
                 }
               }).success(function(getRights){
                // console.log("getRights from this pull", getRights);
                if(getRights.length == 0){
                  setTimeout(function(){
                    //add to group table
                    $http.post('/api/acls/',{
                        email:eachEmail,
                        group:groupName,
                        resource:eachRes,
                        rights:$scope.accessformData.permission,
                        created: new Date(),
                        created_by:$scope.getCurrentUser()._id   
                      });    
                       $("#groupPermSuccess").show().delay(7500).fadeOut("slow");     
                    },2500);
                 }
                  else{
                  // console.log("same permission found, update now");
                  // if(getRights[0].rights === "Read" || getRights[0].rights === "Write"){
                    setTimeout(function(){
                       getRights.forEach(function(acl_id){
                         $http.put('/api/acls/'+acl_id._id,{
                          group:groupName,
                          rights:$scope.accessformData.permission,
                          edited: new Date(),
                          edited_by:$scope.getCurrentUser()._id   
                         });      
                       });    
                        $("#groupPermSuccess").show().delay(7500).fadeOut("slow");     
                        },3000);
                   // } 
                 } 
              },200);   
          });
         });
        });    
       });
      });
      
      // console.log("Application : " + $scope.formData.appsName + " created at " + new Date() + " by " + $scope.getCurrentUser().name);
      
      // **************Notification*********************
      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' assinged ' + $scope.accessformData.group + ' group access to route'  ;

      // Send notification broadcast to all connected users
      pageCtrlSrv.send_notification(data);
          $modalInstance.close();
      };
  $scope.ok             = function () {
    $modalInstance.close();
   };
  $scope.cancel         = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModalusersAddInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  $scope.errors           = {};
  $scope.getCurrentUser   = Auth.getCurrentUser;

  //controller specific functions
  $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
        $modalInstance.close();
     };
  $scope.ok             = function () {
    $modalInstance.close();
   };
  $scope.cancel         = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModaluserEditInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,userInfo,$modalInstance,userEditDetails,Auth) {

  $scope.userEditData     = userEditDetails;
  console.log($scope.userEditData);
  $scope.getCurrentUser   = Auth.getCurrentUser;
  $scope.userEditformData = {}; 

  $scope.editUser = function(userId){
    console
     $http.put('/api/users/'+userId,{
        name:$scope.userEditformData.name,
        role:$scope.userEditformData.role
        });
       
       // **************Notification*********************
      // console.log("Application : " + $scope.appEditData[$scope.appEditData.length -1].AppsName + " edited at " + new Date() + " by " + $scope.getCurrentUser().name);
       var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' edited user info for ' + $scope.userEditData.name ;
       // console.log(data);  
       // Send notification broadcast to all connected users
       pageCtrlSrv.send_notification(data);
       $modalInstance.close();
      }; 
  $scope.cancel  = function () {
    $modalInstance.dismiss('cancel');
    };
  })
.controller('ModalusersDeleteInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,DeleteDetails,Auth) {
  
  $scope.userDeleteData  = DeleteDetails;
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.ok     = function () {
    $http.delete('/api/users/'+$scope.userDeleteData[$scope.userDeleteData.length -1]._id).success(function(){
        
      // **************Notification*********************
      // console.log("Application : " + $scope.appDeleteData[$scope.appDeleteData.length -1].AppsName + " deleted at " + new Date() + " by " + $scope.getCurrentUser().name);
      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' deleted user ' +
       $scope.userDeleteData[$scope.userDeleteData.length -1].name ;
      // console.log(data);  
       // Send notification broadcast to all connected users
       pageCtrlSrv.send_notification(data);

      });

      $modalInstance.close();
      };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
   };
 })
.controller('ModalgroupEditInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,EditDetails,Auth) {

  $scope.groupEditData     = EditDetails;
  // console.log($scope.groupEditData);
  $scope.getCurrentUser   = Auth.getCurrentUser;
  $scope.groupEditformData = {}; 

  $scope.editGroup = function(groupId){
    var groupName = $scope.groupEditformData.name;
     $http.put('/api/groups/'+groupId,{
        name:$scope.groupEditformData.name,
        desc:$scope.groupEditformData.desc,
        resource:$scope.groupEditformData.resource,
        edited: new Date(),
        edited_by:$scope.getCurrentUser()._id
        });
        
        var res = $scope.groupEditformData.resource;
        console.log("new res after edit", res);
       
       // **************Notification*********************
      // console.log("Application : " + $scope.appEditData[$scope.appEditData.length -1].AppsName + " edited at " + new Date() + " by " + $scope.getCurrentUser().name);
       var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' edited group info for ' + $scope.groupEditData.name ;
       // console.log(data);  
       // Send notification broadcast to all connected users
       pageCtrlSrv.send_notification(data);
       $modalInstance.close();
      }; 
  $scope.cancel  = function () {
    $modalInstance.dismiss('cancel');
    };
  })
.controller('ModalgroupsDeleteInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,DeleteDetails,Auth) {
  
  $scope.groupDeleteData  = DeleteDetails;
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.ok     = function () {
    $http.delete('/api/groups/'+$scope.groupDeleteData[$scope.groupDeleteData.length -1]._id).success(function(){
        
      // **************Notification*********************
      // console.log("Application : " + $scope.appDeleteData[$scope.appDeleteData.length -1].AppsName + " deleted at " + new Date() + " by " + $scope.getCurrentUser().name);
      var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' deleted group ' +
       $scope.groupDeleteData[$scope.groupDeleteData.length -1].name ;
      // console.log(data);  
       // Send notification broadcast to all connected users
       pageCtrlSrv.send_notification(data);
      });

      $modalInstance.close();
      };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
   };
 })
.controller('ModalusersInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth,$timeout) {
  
  //pagination parameters  
  $scope.totalResList   = false;
  $scope.searchBox      = false;
  $scope.totalRes       = '';
  $scope.currentAclPage = 1;
  $scope.pageSize       = 4;
  $scope.maxSize        = 10; //pagination max size is 10

  //editable option show hide
  $scope.editable = false;

  $(document).on('click',".dblClick",function(){
      $scope.editable = true;
  });

  //search pagination
  $scope.searchAcl        = '';

  $scope.getCurrentUser   = Auth.getCurrentUser;

  //search pagination event
  $(document).on('keyup','#input_searchRes',function(){
      $scope.searchPag=true;
      $scope.searchflip = true;
      $('#searchPag').show();
      $('#searchflip').show();
      var searchField = $('#input_searchRes').val();
        if(searchField == ''){
          $scope.searchPag=false;
          $scope.searchflip = false;
          $('#searchPag').hide();
          $('#searchflip').hide();
        }      
     });

  //pagination and page control functions
  $scope.setTotalRes     = function(){
    $scope.totalRes = $scope.resAccess.length;
   };
  $scope.showAllRes      = function(){
    $('#input_searchRes').val('');
    $scope.totalResList  = true;
    $scope.searchBox     = true;
     $('#searchPag').hide();
     $('#searchflip').hide();
   }; 
  $scope.searchResource  = function(){
    // $scope.currentAclPage  = 1;
    $scope.pageSize        = 4;
    $scope.totalResList    = false;
    $scope.searchBox       = false;
    // console.log($scope.currentAclPage);
    // $('input:checkbox').removeAttr('checked');
   }; 
  $scope.filteruserAcl   = function(){
      $timeout(function() { 
        //wait for 'filtered' to be changed
        /* change pagination with $scope.filtered */
        // console.log("$scope.filteredAcl.length",$scope.filteredAcl.length)
        $scope.searchAcl  = $scope.filteredAcl.length;
        $scope.totalRes   = Math.ceil($scope.filteredAcl.length/$scope.pageSize);
       },10);
      };

  //controller specific functions
  $scope.changePermission = function(aclID,perm){
   if(perm == undefined){
    return;
   }
    // var perm = this.res.rights;
    console.log('perm ',perm);
    console.log("line aclID ",aclID);
    //update permission
    $http.put('/api/acls/'+aclID,{
      rights:perm,
      edited: new Date(),
      edited_by:$scope.getCurrentUser()._id   
     }).success(function(getUpdate){
      // $scope.resAccess = getUpdate;
       socket.syncUpdates('acl',$scope.resAccess);
       // **************Notification*********************
      // console.log("Application : " + $scope.appEditData[$scope.appEditData.length -1].AppsName + " edited at " + new Date() + " by " + $scope.getCurrentUser().name);
       var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' edited ACL permission ' ;
       // console.log(data);  
       // Send notification broadcast to all connected users
       pageCtrlSrv.send_notification(data);
     })
    $scope.editable = false;
    // $modalInstance.close();
   };    

  $scope.ok              = function () {
    $modalInstance.close();
   };
  $scope.cancel          = function () {
    $modalInstance.dismiss('cancel');   
   };
  })
.controller('ModalgroupsInstanceCtrl',function ($scope,$http,socket,pageCtrlSrv,$modalInstance,Auth) {
  
  //pagination parameters  
  $scope.totalResList   = false;
  $scope.searchBox      = false;
  $scope.totalRes       = '';
  $scope.currentAclPage = 1;
  $scope.pageSize       = 4;
  $scope.maxSize        = 10; //pagination max size is 10

  //editable option show hide
  $scope.editable = false;

  $(document).on('click',".dblClick",function(){
    $scope.editable = true;
   });

  //search pagination
  $scope.searchAcl        = '';

  $scope.getCurrentUser   = Auth.getCurrentUser;

  //search pagination event
  $(document).on('keyup','#input_searchRes',function(){
      $scope.searchPag=true;
      $scope.searchflip = true;
      $('#searchPag').show();
      $('#searchflip').show();
      var searchField = $('#input_searchRes').val();
        if(searchField == ''){
          $scope.searchPag=false;
          $scope.searchflip = false;
          $('#searchPag').hide();
          $('#searchflip').hide();
        }      
     });

  //pagination and page control functions
  $scope.setTotalRes     = function(){
    $scope.totalRes = $scope.groupMember.length;
   };
  $scope.showAllRes      = function(){
    $('#input_searchRes').val('');
    $scope.totalResList  = true;
    $scope.searchBox     = true;
     $('#searchPag').hide();
     $('#searchflip').hide();
   }; 
  $scope.searchResource  = function(){
    // $scope.currentAclPage  = 1;
    $scope.pageSize        = 4;
    $scope.totalResList    = false;
    $scope.searchBox       = false;
    // console.log($scope.currentAclPage);
    // $('input:checkbox').removeAttr('checked');
   }; 
  $scope.filteruserAcl   = function(){
      $timeout(function() { 
        //wait for 'filtered' to be changed
        /* change pagination with $scope.filtered */
        // console.log("$scope.filteredAcl.length",$scope.filteredAcl.length)
        $scope.searchAcl  = $scope.filteredAcl.length;
        $scope.totalRes   = Math.ceil($scope.filteredAcl.length/$scope.pageSize);
       },10);
      };

  //controller specific functions
  $scope.changePermission = function(aclID,perm){
   if(perm == undefined){
    return;
   }
    // var perm = this.res.rights;
    console.log('perm ',perm);
    console.log("line aclID ",aclID);
    //update permission
    $http.put('/api/acls/'+aclID,{
      rights:perm,
      edited: new Date(),
      edited_by:$scope.getCurrentUser()._id   
     }).success(function(getUpdate){
      // $scope.resAccess = getUpdate;
       socket.syncUpdates('acl',$scope.resAccess);
       // **************Notification*********************
      // console.log("Application : " + $scope.appEditData[$scope.appEditData.length -1].AppsName + " edited at " + new Date() + " by " + $scope.getCurrentUser().name);
       var data = '<strong>'+$scope.getCurrentUser().name+'</strong>' + ' edited ACL permission ' ;
       // console.log(data);  
       // Send notification broadcast to all connected users
       pageCtrlSrv.send_notification(data);
     })
    $scope.editable = false;
    // $modalInstance.close();
   };    

  $scope.ok              = function () {
    $modalInstance.close();
   };
  $scope.cancel          = function () {
    $modalInstance.dismiss('cancel');   
   };
  });  




