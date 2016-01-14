'use strict';

angular.module('poll')
  .factory('userInfo',function ($rootScope,$http,socket,Auth){

    // ************************PROPERTY*********************************************
    
    $rootScope.userData       = [];
    $rootScope.userDevices    = [];
    $rootScope.userApps       = [];
    $rootScope.userUATs       = [];
    $rootScope.userDatas      = [];
    $rootScope.userLoans      = '';
    $rootScope.userPurchase   = [];

    // ************************USER RIGHTS IN ENTIRE POOL********************************************* 
    $rootScope.accessToRoute = '';
    $rootScope.accessPage    = false;
    $rootScope.writePage     = false;
    $rootScope.controllPage  = false;

    // ************************USER POOL********************************************* 
    $rootScope.userRepo       = '';
    $rootScope.groupRepo      = '';
    $rootScope.getUsers       = function(){
      if($rootScope.userRepo == ''){
        $http.get("/api/users/").success(function(getUsers){
          $rootScope.userRepo = getUsers;
          // console.log(getUsers);
          socket.syncUpdates("user",$rootScope.userRepo);
          });
        };
     };

     // ************************USER POOL********************************************* 
    $rootScope.getGroups      = function(){
      if($rootScope.groupRepo == ''){
        $http.get("/api/groups/").success(function(getGroups){
          $rootScope.groupRepo = getGroups;
          // console.log("getGroups",getGroups);
          socket.syncUpdates("group",$rootScope.groupRepo);
          });
        };
     }; 

    // ************************USER ROLES*********************************************   
    $rootScope.roleRepo       = '';
    $rootScope.getRoles       = function(){
      if($rootScope.roleRepo == ''){
        $http.get("/api/roles/").success(function(getRoles){
          $rootScope.roleRepo = getRoles;
          // console.log("getGroups",getGroups);
          socket.syncUpdates("role",$rootScope.roleRepo);
          });
        };
     }; 

    // ************************RESOURCES********************************************* 
    $rootScope.resource = ['main','login','settings','singup','admin','aks','application','device','cab','license','loan','purchase','scan','search','uat','Everything'];

    // ************************ACCESS LEVELS********************************************* 
    
    $rootScope.acl      = ['Read','Write','FullControl'];

    // ************************ACCESS RIGHTS*********************************************

    $rootScope.accessControl     = function(resource,email){
      if(email == undefined){
        return;
      }
      $http.get('/api/acls/rights/',{
          params:{
            resource:resource,
            email:email
          }
        }).success(function(getRights){
            $rootScope.accessToRoute = getRights[0];
            if($rootScope.accessToRoute !== undefined){
              // console.log("resource :: ",$rootScope.accessToRoute.resource, "=> rights :: ",$rootScope.accessToRoute.rights);
            }   
        });
      };
    $rootScope.hasReadAccess     = function(resource,email){
      //initialize first
      $rootScope.writePage = false;
      $rootScope.controlPage = false;
      
      if(email == undefined){
        return false;
      }
      $http.get('/api/acls/rights/',{
          params:{
            resource:resource,
            email:email
          }
        }).success(function(getRights){
            if(getRights[0].rights === "Read"){
             // $rootScope.accessPage = true;
            $rootScope.writePage = false;
            $rootScope.controlPage = false;
           } 
        });
      };  
    $rootScope.hasWriteAccess    = function(resource,email){
      //initialize first
      $rootScope.writePage = false;
      $rootScope.controlPage = false;

      if(email == undefined){
        return false;
      }
      $http.get('/api/acls/rights/',{
          params:{
            resource:resource,
            email:email
          }
        }).success(function(getRights){
          if(getRights.length !== 0){
            // console.log("getRights" , getRights.length);
            if(getRights[0].rights == "Write"){
               $rootScope.writePage = true;
               console.log("userInfo class being executed")
            }
          }else{
            $rootScope.writePage = false;
            $rootScope.controlPage = false;
            console.log("userInfo class hasn't quite being executed")
          }
           
        });
      };    
    $rootScope.hasFullAccess     = function(resource,email){
      //initialize first
      $rootScope.writePage = false;
      $rootScope.controlPage = false;

      if(email == undefined){
        return false;
      }
      $http.get('/api/acls/rights/',{
          params:{
            resource:resource,
            email:email
          }
        }).success(function(getRights){
           if(getRights.length !== 0){
            if(getRights[0].rights === "FullControl"){
             $rootScope.controlPage = true;
             $rootScope.writePage   = true;
           }
         }else{
            $rootScope.writePage = false;
            $rootScope.controlPage = false;
         }
        });
      };      

    // ************************FUNCTION DEFINATION************************************

    $rootScope.showUserDetails   = function(oneID){
      // oneID=angular.lowercase(oneID);
      $http.get('/api/mqusers/oneid/'+oneID).success(function(getUserData){
        $rootScope.userData.push(getUserData);
      });
      };
    $rootScope.showUserDevices   = function(oneID){
      // oneID=angular.lowercase(oneID);
      $http.get('/api/devices/device/'+oneID).success(function(getDevices){
          $rootScope.userDevices = getDevices;
          socket.syncUpdates('device',$rootScope.userDevices);
        });
      };
    $rootScope.showUserApps      = function(oneID){
      // oneID=angular.lowercase(oneID);
      $http.get('/api/licMgts/application/'+oneID).success(function(getApps){
          $rootScope.userApps =getApps;
          socket.syncUpdates('licMgt',$rootScope.userApps);
       });
     };
    $rootScope.showUserUAT       = function(oneID){
      // oneID=angular.lowercase(oneID);
      $http.get('/api/uats/sme/'+oneID).success(function(getUATs){
          $rootScope.userUATs =getUATs;
          socket.syncUpdates('uat',$rootScope.userUATs);
       });
     }; 
    $rootScope.showUserData      = function(oneID){
      // oneID=angular.lowercase(oneID);
      $http.get('/api/hdrives/data/'+oneID).success(function(getDatas){
          $rootScope.userDatas =getDatas;
          socket.syncUpdates('hdrive',$rootScope.userDatas);
       });
     };  
    $rootScope.showUserLoan      = function(oneID){
      // oneID=angular.lowercase(oneID);
      var addLoan = [];

      $http.get('/api/loans/loandata/'+oneID).success(function(getLoans){
        getLoans.forEach(function(loans){
          if(loans.LoanStatus !=="Returned"){
            addLoan.push(loans);
          }     
        });
        console.log(addLoan);
          $rootScope.userLoans = addLoan;
          socket.syncUpdates('loan',$rootScope.userLoans);
       });
     };  
    $rootScope.showUserPurchase  = function(oneID){
      // oneID=angular.lowercase(oneID);
      $http.get('/api/purchases/purdata/'+oneID).success(function(getPurRecords){
          $rootScope.userPurchase = getPurRecords;
          socket.syncUpdates('purchase',$rootScope.userPurchase);
       });
     };  


    // *********************Public API here****************************          
    return {
        resource       : $rootScope.resource,
        userProfile    : function(oneID){
          // oneID=angular.lowercase(oneID);
          $rootScope.showUserDetails(oneID);
          $rootScope.showUserDevices(oneID); 
          $rootScope.showUserApps(oneID); 
          $rootScope.showUserUAT(oneID); 
          $rootScope.showUserData(oneID);
          $rootScope.showUserLoan(oneID); 
          $rootScope.showUserPurchase(oneID); 
          },
        user_array     : $rootScope.getUsers,  
        group_array    : $rootScope.getGroups,
        role_array     : $rootScope.getRoles,
        accessControl  : $rootScope.accessControl,
        hasReadAccess  : $rootScope.hasReadAccess,
        hasWriteAccess : $rootScope.hasReadAccess,    
        hasFullAccess  : $rootScope.hasReadAccess        
        }
    })
