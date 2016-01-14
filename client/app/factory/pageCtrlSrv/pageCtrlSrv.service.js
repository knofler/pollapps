'use strict';

angular.module('poll')
   .factory('pageCtrlSrv',function ($rootScope,$http,socket,$modal,Auth,$timeout,$log,$interval,$filter){
      
      // ************************PROPERTY*********************************************

      // ********************TEMP API RESPONSE HOLDER**********************

      // initial dump from database models
      $rootScope.appRepo         = '';
      $rootScope.licenseRepo     = '';
      $rootScope.deviceRepo      = '';  
      $rootScope.purchaseRepo    = ''; 
      $rootScope.loanRepo        = ''; 
      $rootScope.UATRepo         = '';
      $rootScope.AKSRepo         = '';
      $rootScope.fbeStaffRepo    = '';

      $rootScope.tabname         = ''; 
      $rootScope.showmodalinfo   = {};
      $rootScope.addmodalinfo    = {};
      $rootScope.editmodalinfo   = {};
      $rootScope.deletemodalinfo = {};
      // ******************WORKING TEMP DATA HOLDER******************

      //working temp data
      $rootScope.displayData      = [];
      $rootScope.displayUserData  = '';
      $rootScope.displayGroupData = '';
      $rootScope.appInfoID        = [];
      $rootScope.resAccess        = '';
      $rootScope.groupMember      = '';
      $rootScope.groupResource    = [];
      $rootScope.appUatData       = [];
      $rootScope.appAksData       = [];
      $rootScope.imageLink        = [];
      $rootScope.editImageLink    = [];
      $rootScope.leaseData        = [];
      $rootScope.deviceData       = [];
      $rootScope.purchaseData     = [];
      $rootScope.displayData      = [];
      $rootScope.EditData         = [];
      $rootScope.userEditData     = [];
      $rootScope.deviceEditData   = [];
      $rootScope.DeleteData       = [];
      $rootScope.appAssignData    = [];
      $rootScope.resultArray      = [];
      $rootScope.applicationName  = [];
      $rootScope.OneIDs           = [];
      $rootScope.mqOneIDs         = [];
      $rootScope.appLic           = [];
      $rootScope.appLicApps       = [];
      $rootScope.appUat           = [];
      $rootScope.appAKS           = [];
      $rootScope.hdriveData       = [];
      $rootScope.newEntry         = '';
      $rootScope.lastID           = '';
      $rootScope.last_entry       = ''; 

      // ********************AUTH SERVICE CALL************************
      $rootScope.getCurrentUser  = Auth.getCurrentUser;

      $rootScope.itemCount       = '';
      $rootScope.appName         = '';
      $rootScope.apiCalled       = false;
      $rootScope.addDeviceBtn    = true;

      // *****************************SELECT OPTIONS ARRAY***************************

      // ########### DYNAMIC OPTION ARRAYS####################

      //get Dynamic category lists
      $rootScope.categoryArr              = ['deptData','staffDeptData','supplierData','ManufacturerData','patchCategory',
                    'ZCMCategory','ADCategory','deviceStatus','deviceCategory','deviceSubCategory','appOwnerData',
                    'appScopeData','licTypeData','soePlatformsArray','loanDeviceTypeCategory','loanStatus'
                            ];
      $rootScope.deptData                 = '';
      $rootScope.staffDeptData            = '';
      $rootScope.supplierData             = '';
      $rootScope.ManufacturerData         = '';
      $rootScope.patchCategory            = '';
      $rootScope.ZCMCategory              = '';
      $rootScope.ADCategory               = '';
      $rootScope.deviceStatus             = '';
      $rootScope.deviceCategory           = '';
      $rootScope.deviceSubCategory        = '';
      $rootScope.appOwnerData             = '';
      $rootScope.appScopeData             = '';
      $rootScope.licTypeData              = '';
      $rootScope.soePlatformsArray        = '';
      $rootScope.loanDeviceTypeCategory   = '';
      $rootScope.loanStatus               = '';

      //send notification email for license expiry using nodemailer   
      var licData = '';
      $rootScope.mailTo      = ['rumman.ahmed@mq.edu.au','leisa.harrison@mq.edu.au','alfred.wong@mq.edu.au','andy.baho@mq.edu.au','david.ly@mq.edu.au'];

      $rootScope.sendMail      = function (subject,body){
        var emailCount =1;
       
          $http.post('/api/emails/', {
            to:$rootScope.mailTo,
            from:"Asset Register",
            subject:subject,
            text:body,
            emailCount:emailCount,
            created_at:new Date()
          }).success(function(email){
              console.log(email);
              setTimeout(function(){
                $http.post('/api/sendemail/',{
                  to:email.to,
                  from:email.from,
                  subject:email.subject,
                  text:email.text
                 })
              },200)
            }); 
       };
      $rootScope.hasLicExpired = function (expDate,subject,body) {
         if (expDate === undefined){
          return;
         }else{
          var expDateInt = Date.parse(expDate);
          var today      = new Date().toISOString();
          console.log("Today : ", today)
          var todayInt   = Date.parse(today);
          var diffDate   = Math.ceil( Math.abs( expDateInt - todayInt ) / (1000*3600*24) );
          console.log("diffDate is : ", diffDate);

          if (today > expDate){
            console.log("lic Already expired");
          
            }else if (diffDate <= 30){
              console.log("license will be expiring in 30 days, send notfication email");
                $rootScope.sendMail(subject,body);
            }
            else{
              console.log("lic will expire on " + expDate);
            }
          } 
         };    

      var licData = [];
      $http.get('/api/licenses/').success(function(data){
        licData = data;
        // console.log("Licdata initialized: ", licData)
       });

      //send notification email every week
      $interval(function(){
          // console.log("licData is : ", licData)
          licData.forEach(function(data){
            console.log("data is ", data)
              if (data.lic_expDate == undefined){
                return;
              }else{
                 // console.log("each lic data is : ", data.lic_expDate);
                 var subject = "License Expiry Notice ::: Application: " + data.appName + ", Version: " + data.appVersion;
                 var body = "*******************************************************************"+"\n"+
                 "License expiring on : " + $filter('date')(data.lic_expDate,"longDate")+"\n"+
                 "Name: " + data.appName + "."+"\n"+
                 "Version: " + data.appVersion + ","+"\n"+
                 "Please Contact supplier soon." +"\n"+
                 "Asset Register Team" + "\n"+
                 "*******************************************************************";
                 console.log("subject is ", subject);
                 console.log(body)
                 $rootScope.hasLicExpired(data.lic_expDate,subject,body);
              }     
           })
       },604800000)
  

      //get dynamic options from DB
      $rootScope.getDynamicOptions = function(){
        var catName = '';
        if(catName = "deptData"){
          if($rootScope.deptData == ''){
             $http.get('/api/categorys/category/'+catName).success(function(getOptions){
              // console.log("getOptions",getOptions);
             $rootScope.deptData = getOptions;
             socket.syncUpdates('category',$rootScope.deptData);
             });
           } 
          }
        if(catName = "staffDeptData"){
          if($rootScope.staffDeptData == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.staffDeptData = getOptions;
             socket.syncUpdates('category',$rootScope.staffDeptData);
             });
           }
          }
        if(catName = "supplierData"){
          if($rootScope.supplierData == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.supplierData = getOptions;
             socket.syncUpdates('category',$rootScope.supplierData);
             });
           }
          }  
        if(catName = "ManufacturerData"){
          if($rootScope.ManufacturerData == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.ManufacturerData = getOptions;
             socket.syncUpdates('category',$rootScope.ManufacturerData);
             });
           }
          }
        if(catName = "patchCategory"){
          if($rootScope.patchCategory == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.patchCategory = getOptions;
             socket.syncUpdates('category',$rootScope.patchCategory);
             });
          }
          } 
        if(catName = "ZCMCategory"){
          if($rootScope.ZCMCategory == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.ZCMCategory = getOptions;
             socket.syncUpdates('category',$rootScope.ZCMCategory);
             });
            }
          }  
        if(catName = "ADCategory"){
          if($rootScope.ADCategory == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.ADCategory = getOptions;
             socket.syncUpdates('category',$rootScope.ADCategory);
             });
          }
          }
        if(catName = "deviceStatus"){
          if($rootScope.deviceStatus == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.deviceStatus = getOptions;
             socket.syncUpdates('category',$rootScope.deviceStatus);
             });
          }
          }  
        if(catName = "deviceCategory"){
          if($rootScope.deviceCategory == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.deviceCategory = getOptions;
             socket.syncUpdates('category',$rootScope.deviceCategory);
             });
          }
          }  
        if(catName = "deviceSubCategory"){
          if($rootScope.deviceSubCategory == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.deviceSubCategory = getOptions;
             socket.syncUpdates('category',$rootScope.deviceSubCategory);
             });
          }
          }  
        if(catName = "appOwnerData"){
          if($rootScope.appOwnerData == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.appOwnerData = getOptions;
             socket.syncUpdates('category',$rootScope.appOwnerData);
             });
          }
          }  
        if(catName = "appScopeData"){
          if($rootScope.appScopeData == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.appScopeData = getOptions;
             socket.syncUpdates('category',$rootScope.appScopeData);
             });
          }
          }
        if(catName = "licTypeData"){
          if($rootScope.licTypeData == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.licTypeData = getOptions;
             socket.syncUpdates('category',$rootScope.licTypeData);
             });
          }
          } 
        if(catName = "soePlatformsArray"){
          if($rootScope.soePlatformsArray == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.soePlatformsArray = getOptions;
             socket.syncUpdates('category',$rootScope.soePlatformsArray);
             });
            }
          }  
        if(catName = "loanDeviceTypeCategory"){
          if($rootScope.loanDeviceTypeCategory == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.loanDeviceTypeCategory = getOptions;
             socket.syncUpdates('category',$rootScope.loanDeviceTypeCategory);
             });
          }
          }
        if(catName = "loanStatus"){
          if($rootScope.loanStatus == ''){
          $http.get('/api/categorys/category/'+catName).success(function(getOptions){
             $rootScope.loanStatus = getOptions;
             socket.syncUpdates('category',$rootScope.loanStatus);
             });
           }
          } 
  
       };

      
      // ************************FUNCTION DEFINATION************************************

      $rootScope.checkedList        = function() {
        var selectList = [];
        $("input:checked").each(function(){
              selectList.push(this.id);
            });
         console.log(selectList);
         return selectList;
       };
      // status change function on select for toolbars 
      $rootScope.applyAction        = function(actionname){

        var leaseStats         = "";
        var dbAttrib           = '';
        var selectList         = [];
        var data               = '';
        var input              = "yes";
        var status             = ['Loan','NOT FOUND','On Rental','OutRight','Returned','To Be Returned'];
        
        if      (actionname == 'patch'){
          $("input:checked").each(function(){
                selectList.push(this.id);
                 $http.put('/api/leases/'+this.id,{
                    Removed_from_Patchlink:input,
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                    });
            });
           data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has just removed ' + selectList.length + ' devices from patchlink.';
          
          //change to true to make ng-show bring filter back
          $rootScope.patchBtn = true;
          $rootScope.ZCMBtn = true;
          $rootScope.ADBtn = true;
          }
        else if (actionname == 'ZCM'){
            $("input:checked").each(function(){
                selectList.push(this.id);
                 $http.put('/api/leases/'+this.id,{
                    Retired_from_ZCM:input,
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                    });
            });
            data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has just retired ' + selectList.length + ' devices from ZCM.';

            //change to true to make ng-show bring filter back
            $rootScope.patchBtn = true;
            $rootScope.ZCMBtn = true;
            $rootScope.ADBtn = true;

           }
        else if (actionname == 'AD'){
            $("input:checked").each(function(){
                selectList.push(this.id);
                 $http.put('/api/leases/'+this.id,{
                    Removed_from_AD:input,
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                    });
            });
            data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has just removed ' + selectList.length + ' devices from Active Directory.';

            //change to true to make ng-show bring filter back
            $rootScope.patchBtn = true;
            $rootScope.ZCMBtn = true;
            $rootScope.ADBtn = true;
           }  
        else if (actionname == 'return'){
          
          $("input:checked").each(function(){
            selectList.push(this.id);
            var select_id = this.id;
            $http.get('/api/leases/'+select_id).success(function(getChecked){
             var chkData = getChecked;
                if (chkData.LeaseStatus == 'OutRight' ){    
                  leaseStats = 'OutRight';
                  return;
                 }
                else{
                  $http.put('/api/leases/'+select_id,{
                    LeaseStatus:status[4],
                    returned: new Date(),
                    returned_by:$rootScope.getCurrentUser()._id
                    });
                 }
             });  
            });  
            
              data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has returned ' + selectList.length + ' devices to Equigroup.';  
            
              //change to true to make ng-show bring filter back
              $rootScope.patchBtn  = true;
              $rootScope.ZCMBtn    = true;
              $rootScope.ADBtn     = true;
              $rootScope.returnBtn = true;
         }   
        else if (actionname == 'loanReturn'){
          $("input:checked").each(function(){
            selectList.push(this.id);
            var select_id = this.id;
            $http.get('/api/loans/'+select_id).success(function(getChecked){
             var chkData = getChecked;
                if (chkData.LoanStatus == 'On Loan' || chkData.LoanStatus == 'Overdue' ){    

                  $http.put('/api/loans/'+select_id,{
                    LoanStatus:"Returned",
                    ReturnedDate: new Date(),
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                    });
                 }
             });  
            });  
            
              data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has received ' + selectList.length + ' loan items.';  
            
              //change to true to make ng-show bring filter back
              $rootScope.loanReturnBtn = true;
         }   
    
        // **************Notification*********************
        setTimeout(function(){
          // console.log(leaseStats)
          if(leaseStats !== "OutRight"){
           if(selectList.length > 0){
            $rootScope.notify(data);
            }
          }  
        },150);
       
       }; 
      $rootScope.removeAction       = function(actionname){
        var dbAttrib   = '';
        var data       = '';
        var input      = "yes";
        
        if     (actionname == 'patch'){
          var selectList = [];
          var chkData  = [];
          $("input:checked").each(function(){
            var select_id = this.id;
            selectList.push(select_id);
              //check if patchlink action being applied
              $http.get('/api/leases/'+select_id).success(function(getChecked){
                chkData.push(getChecked);
                if(chkData[0].Removed_from_Patchlink == 'yes'){
                  //remove patchlink action applied before
                  $http.put('/api/leases/'+select_id,{
                    Removed_from_Patchlink:'',
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                   });
                 }
              });
          });
          data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has restored ' + selectList.length + ' devices to patchlink.'
          //change to true to make ng-show bring filter back
          $rootScope.patchBtn = true;
          $rootScope.ZCMBtn = true;
          $rootScope.ADBtn = true;
          } 
        else if(actionname == 'ZCM'){
          var selectList = [];
           var chkData  = [];
          $("input:checked").each(function(){
            var select_id = this.id;
            selectList.push(select_id);
            // console.log(selectList)
              //check if patchlink action being applied
              $http.get('/api/leases/'+select_id).success(function(getChecked){
                chkData.push(getChecked);
                if(chkData[0].Retired_from_ZCM == 'yes'){
                  //remove patchlink action applied before
                  $http.put('/api/leases/'+select_id,{
                    Retired_from_ZCM:'',
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                   });
                 }
              });
          });
          data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has restored ' + selectList.length + ' devices to ZCM.'

          //change to true to make ng-show bring filter back
          $rootScope.patchBtn = true;
          $rootScope.ZCMBtn = true;
          $rootScope.ADBtn = true;
         }
        else if(actionname == 'AD'){
          var selectList = [];
           var chkData  = [];
          $("input:checked").each(function(){
            var select_id = this.id;
            selectList.push(select_id);
            // console.log(selectList)
              //check if patchlink action being applied
              $http.get('/api/leases/'+select_id).success(function(getChecked){
                chkData.push(getChecked);
                if(chkData[0].Removed_from_AD == 'yes'){
                  //remove patchlink action applied before
                  $http.put('/api/leases/'+select_id,{
                    Removed_from_AD:'',
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                   });
                 }
              });
          });
          data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has restored ' + selectList.length + ' devices to AD.'

          //change to true to make ng-show bring filter back
          $rootScope.patchBtn = true;
          $rootScope.ZCMBtn = true;
          $rootScope.ADBtn = true;
         }  
        else if(actionname == 'status'){
          var selectList = [];
           var chkData  = [];
           var status = ['Loan','NOT FOUND','On Rental','OutRight','Returned','To Be Returned'];
          $("input:checked").each(function(){
            var select_id = this.id;
            selectList.push(select_id);
            // console.log(selectList)
              //check if patchlink action being applied
              $http.get('/api/leases/'+select_id).success(function(getChecked){
                chkData.push(getChecked);
                if(chkData[0].LeaseStatus !== 'On Rental'){
                  //remove patchlink action applied before
                  $http.put('/api/leases/'+select_id,{
                    LeaseStatus: 'On Rental',
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                   });
          }
              });
              });
          data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has restored ' + selectList.length + ' devices to AD.'

          //change to true to make ng-show bring filter back
          $rootScope.patchBtn  = true;
          $rootScope.ZCMBtn    = true;
          $rootScope.ADBtn     = true;
          $rootScope.returnBtn = true;
         }  
        else if(actionname == 'loanReturn'){
          var selectList = [];
          var chkData  = [];
          $("input:checked").each(function(){
            var select_id = this.id;
            selectList.push(select_id);
              //check if patchlink action being applied
              $http.get('/api/loans/'+select_id).success(function(getChecked){
                chkData.push(getChecked);
                if(chkData[0].LoanStatus == 'Returned'){
                  //remove patchlink action applied before
                  $http.put('/api/loans/'+select_id,{
                    LoanStatus:'On Loan',
                    edited: new Date(),
                    edited_by:$rootScope.getCurrentUser()._id
                   });
                 }
              });
          });
          data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has restored ' + selectList.length + ' loan items'
          //change to true to make ng-show bring filter back
          $rootScope.loanReturnBtn = true;
          } 
        else if(actionname == 'addDevice'){
          $("input:checked").each(function(){
                // selectDevicesList.push(this.id);
                $http.get('api/scans/'+this.id).success(function(getDevice){
                    selectDevicesList.push(getDevice); 
                     console.log(selectDevicesList[0].deviceName);
                  });
                console.log(selectDevicesList);
                   //get last inserted id
                   $rootScope.getLastEntry("leases");
                   console.log($rootScope.newEntry);
                 
                   // $http.post('/api/leases/',{
                   //    AssetNumber:$rootScope.newEntry,
                   //    Barcode:$scope.formData.Barcode,
                   //    MachineName:$scope.formData.MachineName,
                   //    SerialNumber:$scope.formData.SerialNumber,
                   //    LeaseStatus:"On Rental",
                   //    Specs:$scope.formData.Specs,
                   //    Manufacturer:$scope.formData.Manufacturer,
                   //    Category:$scope.formData.Category,
                   //    SubCategory:$scope.formData.SubCategory,
                   //    FirstName:"ITSU",
                   //    LastName:"IT SPARE",
                   //    OriginalLeaseEndDate:$scope.formData.OriginalLeaseEndDate,
                   //    created: new Date(),
                   //    created_by:$rootScope.getCurrentUser()._id  
                   //  });

            
            });
            data = '<strong>'+$rootScope.getCurrentUser().name+'</strong>' + ' has just retired ' + selectList.length + ' devices from ZCM.';

            //change to true to make ng-show bring filter back
            $rootScope.addDeviceBtn = true;

           }  

       }; 
      $rootScope.checkFilter_status = function(eachID,name){
        //check if checked item has any filter applied 
        var dbAttrib            = '';
        var selectList          = [];
        var chkDeviceData       = '';
        var chkScanDeviceData   = '';
        var chkLoanData         = '';
        var data                = '';
        var input               = "yes";
        var select_id           = eachID;


        selectList.push(select_id);
        //lookup lease db for status check
        if (name == "device"){ 
          $http.get('/api/leases/'+select_id).success(function(getChecked){
            chkDeviceData = getChecked;
            if (chkDeviceData.Removed_from_Patchlink == 'yes'){
              $rootScope.patchBtn = false;
             }else{
              $rootScope.patchBtn = true;
             }
            if (chkDeviceData.Retired_from_ZCM       == 'yes'){
              $rootScope.ZCMBtn = false;
             }else{
               $rootScope.ZCMBtn = true;
              }
            if (chkDeviceData.Removed_from_AD        == 'yes'){
              $rootScope.ADBtn = false;
                }else{
                 $rootScope.ADBtn = true;
             }
            if (chkDeviceData.LeaseStatus            == 'On Rental' || chkDeviceData.LeaseStatus == 'OutRight' || chkDeviceData.LeaseStatus == 'To Be Returned'){
              $rootScope.returnBtn = true;
                }
                else{
                $rootScope.returnBtn = false;
               }   
           });          
         }
        else if (name == "loan"){
          $http.get('/api/loans/'+select_id).success(function(getChecked){
            chkLoanData = getChecked;
              if (chkLoanData.LoanStatus == 'Returned'){
                $rootScope.loanReturnBtn = false;
               }else{
                $rootScope.loanReturnBtn = true;
               }
           });  
         }
        else if (name == "addDevice"){
          $http.get('/api/scans/'+select_id).success(function(getChecked){
               chkScanDeviceData = getChecked;
               var deviceName = angular.uppercase(chkScanDeviceData.deviceName);
                // console.log(deviceName);
             $http.get('/api/leases/device/'+deviceName).success(function(getDevice){
                // console.log(getDevice);
                if(getDevice !== "null"){
                  $rootScope.addDeviceBtn = false;
                }else{
                   $rootScope.addDeviceBtn = true;
                }
             });  

          });
          
         } 

       };  
      //Multiple quey for data validity
      $rootScope.runMultiQuery      = function(appname,appversion){    
        $http.get('/api/applications/multipleApp/',{
          params:{
            appname:appname,
            appversion:appversion
            }
            }).success(function(getApp){     
              $rootScope.itemCount=getApp;
              socket.syncUpdates('application',$rootScope.itemCount);
             });
        setTimeout(function() {
          if($rootScope.itemCount !== null) {
            // console.log("$rootScope.itemCount outside runMultiQuery function is " + $rootScope.itemCount.toString());
                for(var i=0;i<$rootScope.itemCount.length;i++){
                  $rootScope.resultArray.push($rootScope.itemCount[i].AppsName);
                };
            console.log("resultArray is " + $rootScope.resultArray);
            console.log("resultArray length is " + $rootScope.resultArray.length);
                clearInterval();
              }
             }, 100); 
           
        }; 
      //Print to PDF a selected DOM element with any specific id   
      $rootScope.createPDF          = function(divName){
       var printContents = document.getElementById(divName).innerHTML;
       var originalContents = document.body.innerHTML;
       document.body.innerHTML = printContents;
          window.print();  // Print preview
          document.body.innerHTML = originalContents;
          location.reload();
       }; 
      //get last inserted document record 
      $rootScope.getLastEntry       = function(model){
        if(model == "purchases"){
             $http.get('/api/'+model+'/last/').success(function(getLastEntry){
                var lastEntry = getLastEntry.faculty_ref;
                //remove numaric data from mixed string
                var numbersData = lastEntry.replace(/\D/g,'');
                //increament number
                numbersData++;
                $rootScope.newEntry = "E"+numbersData;
                console.log("lastEntry:",lastEntry);
                console.log("$rootScope.newEntry:",$rootScope.newEntry);
              });
           }else{
              $http.get('/api/'+model+'/last/').success(function(getLastEntry){
                var lastEntry = getLastEntry.AssetNumber;
                $rootScope.newEntry = lastEntry + 1
                console.log("lastEntry:",lastEntry);
                console.log('$rootScope.newEntry:',$rootScope.newEntry);
               });
           }     
       };  
         //get last inserted document record 
      $rootScope.getLastID          = function(model){
        $http.get('/api/'+model+'/last/').success(function(getLastEntry){
            $rootScope.lastID = getLastEntry._id;
            $rootScope.last_entry = getLastEntry;
          console.log("lastID:",$rootScope.lastID);
         });
       };  
      //Function to write to CSV
      $rootScope.writetoCsv         = function(data,columnLength,dataHeader){
        if (data == ''){
          return false;
        }
        var count = 0;
        var headerCount = 0;

        var csvContent = "data:text/csv;charset=utf-8,";
        
        dataHeader.forEach(function(header){
          if(headerCount == columnLength){
            headerCount = 0;
          }
          csvContent+= headerCount < columnLength-1 ? header+ "," : header+"\n";
           headerCount++;  
         });
        data.forEach(function(infoArray){
          console.log("infoArray is " +infoArray);
          if(count == columnLength){
            count = 0;
          }
          console.log("count is ", count);
          csvContent += count < columnLength-1 ? infoArray+ "," : infoArray+"\n";
           count++;  
         });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "custom_report.csv");
        link.click(); // This will download the data file named "my_data.csv".
        console.log("Data from function is : ", data);
        console.log("csvContent",csvContent);
       }; 



      // ***********************************Communication socket function*************************

      //send update notification
      $rootScope.notify = function(data){
        socket.socket.emit("update",data);
        };
      //Receive updates and notification of any changes through socket
      socket.socket.on('get_update',function(data){
        $(".mainContainer")
        .append(
          '<div class="notifyUser" id="notifyItem">'+
                '<div class="notifyContent">'+data+
                '</div>'+
           '</div>'
        );
        $(".notifyUser").delay(7500).fadeOut("slow");  

        $(".mainContainer2")
        .append(
          '<div class="notifyUser2" id="notifyItem">'+
                '<div class="notifyContent">'+data+
                '</div>'+
           '</div>'
        );
        $(".notifyUser2").delay(7500).fadeOut("slow");  
       });  

      // ************************************EVENTS*********************************************

      //checkall event
      $(document).on("change","#checkall",function(){
        //check all when this class selected
        $(".checkthis").prop('checked',this.checked);
        //show toolbar when cheked
          $("#toolbar").fadeIn("slow")
        //hide toolbar when none selected  
          if(!this.checked){
            $("#toolbar").fadeOut("slow");
          }
       });
      $(document).on("change",".checkthis",function(e){
        // alert(e.target.nodeName);
        // alert(e.target.id);

        //on each checked item run following function  
        $("input:checked").each(function(){
          $rootScope.checkFilter_status(this.id)
            });
         
          //show toolbar when any one of them checked 
          $("#toolbar").fadeIn("slow");


          //hide when nothing checked
          if(!$("input:checked").is(":checked")){
            // alert("Not checked");
              $("#toolbar").fadeOut("slow");
           }
        });
      $(document).on('keydown','.mq_selec2',function(){
        $("#showSpin").show();
        $(document).on('keyup','.mq_selec2',function(){
          $("#showSpin").hide();
        });
        });



      // ****************************API CALL*****************************************
       
      // Load temp Array with query data  
      $rootScope.getApp_repo      = function(){
        if($rootScope.appRepo == ''){
               $http.get('/api/applications').success(function(getApp){
            $rootScope.appRepo=getApp;
            socket.syncUpdates('application',$rootScope.appRepo)
            });
          }
        };   
      $rootScope.getlic_repo      = function(){
        if($rootScope.licenseRepo == ''){
          $http.get('/api/licenses/').success(function(getlicense){
            $rootScope.licenseRepo=getlicense;
            socket.syncUpdates('license',$rootScope.licenseRepo)
            });
         };
        };  
      $rootScope.getDevice_repo   = function(){
        if($rootScope.deviceRepo == ''){
          $http.get('/api/leases/').success(function(getDevice){
            $rootScope.deviceRepo=getDevice;
          socket.syncUpdates('lease',$rootScope.deviceRepo)
          });
         } 
        };    
      $rootScope.getLoan_repo     = function(){
        var today = new Date().toISOString();
        // console.log("today is : ", today);
        if($rootScope.loanRepo == ''){
          $http.get('/api/displays/').success(function(getLoan){
            getLoan.forEach(function(data){
              // console.log('duedate is : ' , data.DueDate );
                if(today > data.DueDate  && data.LoanStatus == "On Loan"){
                  $http.put('/api/loans/'+data._id,{
                    LoanStatus: 'Overdue',
                    edited: new Date(),
                    edited_by:"SYSTEM AUTO"
                    });
                  // console.log("duedat to enter");
                }
              });
             $rootScope.loanRepo = getLoan;
          socket.syncUpdates('loan',$rootScope.loanRepo)
          });
         } 
        };      
      $rootScope.getPurchase_repo = function(){
        if($rootScope.purchaseRepo == ''){
          $http.get('/api/purchases/').success(function(getPurchase){
            $rootScope.purchaseRepo=getPurchase;
          socket.syncUpdates('purchase',$rootScope.purchaseRepo)
          });
         } 
          };        
      $rootScope.getMq_users      = function(){
          if($rootScope.mqOneIDs == ''){
            $http.get('/api/mqusers').success(function(getOneID){
              $rootScope.mqOneIDs.push(getOneID);
            socket.syncUpdates('mquser',$rootScope.mqOneIDs)
            });
           };
          };
      $rootScope.get_Fbe_Mq_users = function(){
          if($rootScope.OneIDs == ''){
            $http.get('/api/fbemqusers').success(function(getOneID){
              $rootScope.OneIDs.push(getOneID);
            socket.syncUpdates('fbemquser',$rootScope.OneIDs)
            });
           };
          };    
      $rootScope.get_FbeStaff_dir = function(){
        $http.get('/api/fbestaffdirs').success(function(getFbeStaff){
          $rootScope.fbeStaffRepo = getFbeStaff;
        socket.syncUpdates('fbestaffdir',$rootScope.fbeStaffRepo)
        });
        };        
      $rootScope.getUAT_repo      = function(){    
        if( $rootScope.UATRepo == ''){
          $http.get('/api/uats/').success(function(getUAT){
            $rootScope.UATRepo=getUAT;
            socket.syncUpdates('uat',$rootScope.UATRepo)
           });
         };
        };    
      $rootScope.getAKS_repo      = function(){    
        if($rootScope.AKSRepo == ''){
          $http.get('/api/akss/').success(function(getAKS){
            $rootScope.AKSRepo=getAKS;
            socket.syncUpdates('aks',$rootScope.AKSRepo)
           });
         }
        };   

      // *********************Public API here****************************  
      return {

          runMultiQuery       : $rootScope.runMultiQuery,
          mqUsers_array       : $rootScope.getMq_users,
          mqUsers_SelectArray : $rootScope.get_Fbe_Mq_users,
          fbeStaffDir_array   : $rootScope.get_FbeStaff_dir,
          appRepo_array       : $rootScope.getApp_repo,
          deviceRepo_array    : $rootScope.getDevice_repo,
          loanRepo_array      : $rootScope.getLoan_repo,
          purchaseRepo_array  : $rootScope.getPurchase_repo,
          UATRepo_array       : $rootScope.getUAT_repo,
          AKSRepo_array       : $rootScope.getAKS_repo,
          licRepo_array       : $rootScope.getlic_repo,
          category_array      : $rootScope.getDynamicOptions,
          send_notification   : $rootScope.notify,
          csvOut              : $rootScope.writetoCsv,
          addCategory         : $rootScope.addCategory,
          last_id             : $rootScope.getLastID,
          
          //Open modals with appropriate parameters
          popAdd    : function(ctrlName,size){
            $rootScope.currentPage =1;
              if (ctrlName == 'devices'){
                var modalAddInstance = $modal.open({
                  templateUrl:'components/modal/'+ctrlName+'AddModal.html',
                  controller:'Modal'+ctrlName+'AddInstanceCtrl'
               });    
              }else if (ctrlName == "devicesBulk"){         
               var modalAddInstance = $modal.open({
                  templateUrl:'components/modal/'+ctrlName+'AddModal.html',
                  controller:'Modal'+ctrlName+'AddInstanceCtrl'
               });    
              }else if (ctrlName == 'purchases'){
                var modalAddInstance = $modal.open({
                  templateUrl:'components/modal/'+ctrlName+'AddModal.html',
                  controller:'Modal'+ctrlName+'AddInstanceCtrl',
                  resolve : {
                    suggestData : function(){
                      return {
                        deptData:$rootScope.deptData,
                        supplierData:$rootScope.supplierData
                      }
                    }
                  }
               });  
              }else if (ctrlName == 'uats'){
                var modalAddInstance = $modal.open({
                    templateUrl:'components/modal/'+ctrlName+'AddModal.html',
                    controller:'Modal'+ctrlName+'AddInstanceCtrl',
                    resolve : {
                      mq_users : function(){
                        return $rootScope.OneIDs;
                      }
                    }
                 }); 
              }else {
                var modalAddInstance = $modal.open({
                  templateUrl:'components/modal/'+ctrlName+'AddModal.html',
                  controller:'Modal'+ctrlName+'AddInstanceCtrl',
                  size:size
                }); 
              }
              // alert(ctrlName);
            },
          popDelete : function(ctrlName,targetID){
            if(ctrlName =='devices'){
              ctrlName = 'leases';
            }
            if(ctrlName !== "categorys"){
            $http.get('/api/'+ctrlName+'/'+targetID).success(function(getTarget){
              $rootScope.DeleteData.push(getTarget);
              });
            }
              var modalDelInstance = $modal.open({
                  templateUrl:'components/modal/'+ctrlName+'DeleteModal.html',
                  controller:'Modal'+ctrlName+'DeleteInstanceCtrl',
                  resolve: {
                  DeleteDetails: function () {
                  return $rootScope.DeleteData;
                    }
                  }
              });
            },
          popEdit   : function(ctrlName,targetID) {
            if(ctrlName == 'device'){
              $http.get('/api/leases/'+targetID).success(function(getLease){
                if(getLease !==null){
                 $rootScope.EditData.push(getLease);
                 }
                socket.syncUpdates('lease',$rootScope.EditData);
               });
              var thingToSearch=angular.lowercase($rootScope.EditData.MachineName);
                 $http.get('/api/devices/name/'+thingToSearch).success(function(getDevice){
                    if(getDevice !==null){
                      $rootScope.deviceEditData.push(getDevice);
                     }
                   socket.syncUpdates('device',$rootScope.deviceEditData)
                    });
             }
            else if(ctrlName == 'user'){
             $http.get('/api/users/user/'+targetID).success(function(getUser){
                if(getUser !==null){
                 $rootScope.userEditData.push(getUser);
                 }
                socket.syncUpdates('user',$rootScope.userEditData);
               });
             }
            else if(ctrlName == 'aks'){
             $http.get('/api/'+ctrlName+'s/'+targetID).success(function(getTarget){
                $rootScope.EditData.push(getTarget);
                 $rootScope.editImageLink = getTarget.mediaLocation.split(",");
                 console.log("$scope.editImageLink from pagecontrol is :: ", $rootScope.editImageLink);
                socket.syncUpdates(ctrlName,$rootScope.EditData)
               });
             }
            else{
              $http.get('/api/'+ctrlName+'s/'+targetID).success(function(getTarget){
                $rootScope.EditData.push(getTarget);
                socket.syncUpdates(ctrlName,$rootScope.EditData)
               });
             }
            var modalEditInstance = $modal.open({
              templateUrl: 'components/modal/'+ctrlName+'EditModal.html',
              controller: 'Modal'+ctrlName+'EditInstanceCtrl',
              resolve: {
                EditDetails: function () {
                  return $rootScope.EditData;
                },
                deviceEditDetails: function(){
                  return $rootScope.deviceEditData;
                },
                userEditDetails: function(){
                  return $rootScope.userEditData;
                }
              }  
              });
           },
          popAssign : function(appID){
            console.log("pop assign appName is: ", appID);
            $rootScope.applicationName = appID;
              var modalAppAssignInstance = $modal.open({
                templateUrl: 'components/modal/appAssignModal.html',
                controller: ModalAppAssignInstanceCtrl,
                resolve:{
                    applicationName:function(){
                      return $rootScope.applicationName;
                    }
                  }
               });
           },
          popCSV    : function(tabname,size){
            $rootScope.tabname = tabname;   
            console.log("$rootScope.tabname is ", $rootScope.tabname)
             var modalCSVInstance = $modal.open({
                templateUrl:'components/modal/CSVModal.html',
                controller:'ModalCSVInstanceCtrl',
                size:size
             });
             },  
          popUsers  : function(size,oneID){
            // oneID=angular.lowercase(oneID);
            // console.log("oneID inserting ", oneID);
            oneID = oneID.replace(/\D/g,'');
            // console.log("oneID Querying ", oneID);
              $http.get('/api/mqusers/oneid/'+oneID).success(function(getUserData){
                if(getUserData !== "null"){
                   $rootScope.targetoneID=getUserData.OneID;
                    var modalUserInfo =$modal.open({
                      templateUrl:'components/modal/userModal.html',
                      controller:'ModalUserInfoInstanceCtrl',
                      resolve:{ 
                        oneID:function(){
                          return $rootScope.targetoneID;
                         }
                       },
                       size:size
                     });
                }else{
                  // alert("user doesnt exist");
                  // return;
                   $rootScope.targetoneID=oneID;
                   var modalUserMissing =$modal.open({
                      templateUrl:'components/modal/userMissingModal.html',
                      controller:ModalUserMissingCtrl,
                      resolve:{ 
                        oneID:function(){
                          return $rootScope.targetoneID;
                         }
                       }
                     });
                } 
              });
           },
          popDelwarn: function(ctrlName,internal,targetID,imgName){
            console.log("image del id is :: ", targetID, " and image name is :: ", imgName + " internal : ", internal);
            $http.get('/api/'+ctrlName+'s/'+targetID).success(function(getTarget){
              console.log("DeleteData for AKS is :: ", getTarget)
                $rootScope.DeleteData.push(getTarget);
              });
            var modallicDelInstance = $modal.open({
              templateUrl:'components/modal/'+internal+'DeleteWarningModal.html',
              controller:'Modal'+internal+'DeleteWarningCtrl',
              resolve: {
                delWarn: function () {
                  return {
                    delData:$rootScope.DeleteData,
                    imgtoDel:imgName
                  }
                }
              }
              })
            },
          showData  : function(Name,ctrlName,targetID,optionalName) {
            $rootScope.applicationName = Name;
                if(ctrlName       == 'applications' && optionalName == 'licMgts'){
                  $http.get('/api/licMgts/'+targetID).success(function(getapp){
                      $rootScope.displayData.push(getapp);
                      console.log($rootScope.displayData.AppsName);
                    socket.syncUpdates('licMgt',$rootScope.displayData);
                    var thingToSearch=$rootScope.displayData[$rootScope.displayData.length-1].appName;
                      $http.get('/api/applications/name/'+thingToSearch).success(function(getapp){
                          $rootScope.displayData.push(getapp);
                          socket.syncUpdates('application',$rootScope.displayData);
                          });
                      $http.get('/api/licenses/name/'+thingToSearch).success(function(getappLic){
                       if(getappLic !== null){
                           $rootScope.appLic.push(getappLic);
                          }
                        socket.syncUpdates('license',$rootScope.appLic)
                        });
                      $http.get('/api/uats/name/'+thingToSearch).success(function(getappUat){
                        if(getappUat !== null){
                          $rootScope.appUat.push(getappUat);
                         }
                        socket.syncUpdates('uat',$rootScope.appUat)
                        });    
                 });
                }else if(ctrlName == 'applications' && optionalName == 'uats'){
                  $http.get('/api/uats/'+targetID).success(function(getapp){
                      $rootScope.displayData.push(getapp);
                      console.log($rootScope.displayData.uat_appName);
                    socket.syncUpdates('uat',$rootScope.displayData);
                    var thingToSearch=$rootScope.displayData[$rootScope.displayData.length-1].uat_appName;
                      $http.get('/api/applications/name/'+thingToSearch).success(function(getapp){
                          $rootScope.displayData.push(getapp);
                          socket.syncUpdates('application',$rootScope.displayData);
                          });
                      $http.get('/api/licenses/name/'+thingToSearch).success(function(getappLic){
                       if(getappLic !== null){
                           $rootScope.appLic.push(getappLic);
                          }
                        socket.syncUpdates('license',$rootScope.appLic)
                        });
                      $http.get('/api/uats/name/'+thingToSearch).success(function(getappUat){
                        if(getappUat !== null){
                          $rootScope.appUat.push(getappUat);
                         }
                        socket.syncUpdates('uat',$rootScope.appUat)
                        });    
                    });
                }else if(ctrlName == 'uats'         && optionalName == 'applications'){
                  $http.get('/api/'+ctrlName+'/'+targetID).success(function(getData){
                      $rootScope.appUatData.push(getData);
                      var model = ctrlName.substring(0, ctrlName.length - 1);
                      console.log(model);
                      socket.syncUpdates(model,$rootScope.appUatData)
                        });
                }else if(ctrlName == 'akss'         && optionalName == 'applications'){
                  $http.get('/api/'+ctrlName+'/'+targetID).success(function(getAKSData){
                    console.log("getAKSData inside pagectrl is :: ", getAKSData)
                      $rootScope.appAksData = getAKSData;
                      $rootScope.imageLink = getAKSData.mediaLocation.split(',')
                      console.log("aksData inside pagectrl is :", $rootScope.imageLink);
                      var model = ctrlName.substring(0, ctrlName.length - 1);
                      console.log(model);
                      socket.syncUpdates(model,$rootScope.appAksData)
                        });
                }else if(ctrlName == 'hdrives'){
                  $http.get('/api/'+ctrlName+'/'+targetID).success(function(getData){
                      $rootScope.hdriveData.push(getData);
                      var model = ctrlName.substring(0, ctrlName.length - 1);
                      console.log(model);
                      socket.syncUpdates(model,$rootScope.hdriveData)
                        });
                }else if(ctrlName == 'applications' && optionalName == undefined){
                  console.log("I am applications and undefined, and I am being executed");
                  $http.get('/api/'+ctrlName+'/'+targetID).success(function(getapp){
                    $rootScope.displayData.push(getapp);
                    socket.syncUpdates('application',$rootScope.displayData)
                    var thingToSearch=$rootScope.displayData[$rootScope.displayData.length-1].AppsName;
                    //Find Application Details
                    $http.get("/api/applications/"+targetID).success(function(getApp){
                      // console.log("getApp is : ", getApp);
                      ///find License information for this application 
                      $http.get('/api/licenses/appquery/',{
                          params:{
                            appname:getApp.AppsName,
                            appversion:getApp.Appversion
                          }
                         }).success(function(getappLic){
                          // console.log("getApplic is : ",getappLic);
                          if(getappLic !== null){
                             $rootScope.appLic.push(getappLic);
                           }
                          socket.syncUpdates('license',$rootScope.appLic)
                         });
                      //find AKS information for this application with name and version
                      $http.get('/api/akss/multipleaksone/',{
                        params:{
                          aksappname:getApp.AppsName,
                          aksappversion:getApp.Appversion
                        }
                        }).success(function(getappAKS){
                        if(getappAKS !== null){
                           $rootScope.appAKS.push(getappAKS);
                         }
                        socket.syncUpdates('aks',$rootScope.appAKS)
                       });
                      //find UAT information for this application with name and version
                      $http.get('/api/uats/multipleuatone/',{
                        params:{
                          uatappname:getApp.AppsName,
                          uatappversion:getApp.Appversion
                        }
                        }).success(function(getappUAT){
                        if(getappUAT !== null){
                           $rootScope.appUat.push(getappUAT);
                         }
                        socket.syncUpdates('uat',$rootScope.appUat)
                       });  
                     });
                      //find UAT information for this application   
                    // $http.get('/api/uats/name/'+thingToSearch).success(function(getappUat){
                    //     if(getappUat !== null){
                    //       $rootScope.appUat.push(getappUat);
                    //      }
                    //     socket.syncUpdates('uat',$rootScope.appUat)
                    //     });
                   });
                }else if(ctrlName == 'licenses'     && optionalName == undefined){
                  $rootScope.applicationName = targetID;
                  console.log("I am licenses show data, and being executed")
                  ctrlName = 'licApps';
                  $http.get('/api/licenses/'+targetID).success(function(getapp){
                     $rootScope.appLicApps.push(getapp);
                     console.log("appLic created : ", $rootScope.appLic);
                      $http.get("/api/applications/multipleAppOne/",{
                        params:{
                          appname:getapp.appName,
                          appversion:getapp.appVersion
                        }
                        }).success(function(getappDetail){
                            if(getappDetail !== null){
                               // $rootScope.displayData.push(getappDetail);
                               console.log("getappDetail to push or string ", getappDetail.AppsName);
                               $rootScope.appInfoID.push(getappDetail);
                                socket.syncUpdates('application',$rootScope.displayData)
                             }

                            socket.syncUpdates('license',$rootScope.appLic)
                            });
                      $http.get('/api/uats/name/'+getapp.appName).success(function(getappUat){
                        if(getappUat !== null){
                          $rootScope.appUat.push(getappUat);
                         }
                        socket.syncUpdates('uat',$rootScope.appUat)
                      });
                    });
                }else if(ctrlName == 'devices'      && optionalName == undefined){
                  $http.get('/api/leases/'+targetID).success(function(getLease){
                      if(getLease !==null){
                       $rootScope.leaseData.push(getLease);
                       }
                      socket.syncUpdates('lease',$rootScope.leaseData);
                      var thingToSearch=angular.lowercase($rootScope.leaseData[$rootScope.leaseData.length-1].MachineName);
                     $http.get('/api/devices/name/'+thingToSearch).success(function(getDevice){
                        if(getDevice !==null){
                          $rootScope.deviceData.push(getDevice);
                         }
                       socket.syncUpdates('device',$rootScope.deviceData)
                        });
                  }); 
                }else if(ctrlName == 'devices'      && optionalName == 'leases'){
                  Name = angular.uppercase(Name); 
                     $http.get('/api/leases/device/'+Name).success(function(getDevice){
                        if(getDevice !==null){
                          $rootScope.leaseData.push(getDevice);
                         }
                         // console.log($rootScope.deviceData[$rootScope.deviceData.length-1].MachineName);
                       socket.syncUpdates('device',$rootScope.deviceData)
                     var thingToSearch=angular.lowercase($rootScope.leaseData[$rootScope.leaseData.length-1].MachineName);
                     $http.get('/api/devices/name/'+thingToSearch).success(function(getDevice){
                        if(getDevice !==null){
                          $rootScope.deviceData.push(getDevice);
                         }
                       socket.syncUpdates('device',$rootScope.deviceData)
                        });
                        });
                }else if(ctrlName == 'purchases'    && optionalName == 'users'){
                  Name = angular.uppercase(Name); 
                     $http.get('/api/purchases/name/'+Name).success(function(getPurchase){
                        if(getPurchase !==null){
                          $rootScope.displayData.push(getPurchase);
                         }
                         // console.log($rootScope.deviceData[$rootScope.deviceData.length-1].MachineName);
                       socket.syncUpdates('purchase',$rootScope.purchaseData)
                        });
                }else if(ctrlName == 'devices'      && optionalName == 'loans'){
                  Name = angular.uppercase(Name);
                     $http.get('/api/leases/device/'+Name).success(function(getDevice){
                        if(getDevice !==null){
                          $rootScope.leaseData.push(getDevice);
                         }
                         // console.log($rootScope.deviceData[$rootScope.deviceData.length-1].MachineName);
                       socket.syncUpdates('device',$rootScope.deviceData)
                     var thingToSearch=angular.lowercase($rootScope.leaseData[$rootScope.leaseData.length-1].MachineName);
                     $http.get('/api/devices/name/'+thingToSearch).success(function(getDevice){
                        if(getDevice !==null){
                          $rootScope.deviceData.push(getDevice);
                         }
                       socket.syncUpdates('device',$rootScope.deviceData)
                        });
                        });
                }else if(ctrlName == 'users'){
                    
                    $http.get('/api/'+ctrlName+'/user/'+targetID).success(function(getData){
                      // console.log("users get data", getData.email);
                      $rootScope.displayUserData = getData;
                      $http.get('/api/acls/email/',{
                        params:{
                          email:getData.email
                         }
                       }).success(function(getRights){
                       $rootScope.resAccess = getRights;
                       // console.log("getRights from this pull", $rootScope.resAccess);
                        socket.syncUpdates(model,$rootScope.resAccess);
                       });
                      
                      var model = ctrlName.substring(0, ctrlName.length - 1);
                      // console.log(model);
                      socket.syncUpdates(model,$rootScope.displayUserData)
                        });
                }else if(ctrlName == 'groups'){
                    $http.get('/api/'+ctrlName+'/'+targetID).success(function(getData){
                      // console.log("users get data", getData.email);
                      $rootScope.displayGroupData = getData;

                        //Get groups info 
                        var res = getData.resource.split(","); 
                        $rootScope.groupResource = res;

                      $http.get('/api/acls/group/',{
                        params:{
                          group:getData.name
                         }
                       }).success(function(getMembers){
                       $rootScope.groupMember = getMembers;
                       // console.log("getMembers from this pull", $rootScope.groupMember);
                       });
                      
                      var model = ctrlName.substring(0, ctrlName.length - 1);
                      // console.log(model);
                      socket.syncUpdates(model,$rootScope.displayGroupData)
                        });
                }else{
                    $http.get('/api/'+ctrlName+'/'+targetID).success(function(getData){
                      console.log("I am out side and I am being executed");
                      $rootScope.displayData.push(getData);
                      var model = ctrlName.substring(0, ctrlName.length - 1);
                      // console.log(model);
                      socket.syncUpdates(model,$rootScope.displayData)
                        });
                    }
            var modalInstance = $modal.open({

              templateUrl: 'components/modal/'+ctrlName+'Modal.html',
              controller: 'Modal'+ctrlName+'InstanceCtrl',
              resolve: {
                dataDetails: function () {
                  return $rootScope.displayData;
                },
                leaseDetails: function () {
                  return $rootScope.leaseData;
                },
                deviceDetails: function () {
                  return $rootScope.deviceData;
                },
                appLic: function () {
                  return $rootScope.appLic;
                },
                appUat: function () {
                  return $rootScope.appUat;
                },
                appAKS: function () {
                  return $rootScope.appAKS;
                },
                uatAppdata: function () {
                  return $rootScope.appUatData;
                },
                aksAppdata: function () {
                  return $rootScope.appAksData;
                },
                hdriveData: function () {
                  return $rootScope.hdriveData;
                },
                applicationName:function(){
                return $rootScope.applicationName;
                },
                applicationInfo:function(){
                return $rootScope.appInfoID;
                }

               } 
              });
            },
          showUser  : function(appID){
             $rootScope.applicationName = appID;
              var modalLicUser =$modal.open({
                templateUrl:'components/modal/licUserModal.html',
                controller:ModallicUserInstanceCtrl,
                resolve:{
                  applicationName:function(){
                    return $rootScope.applicationName;
                  }
                }
                 });
              modalLicUser.result.then(function (selectedItem) {
                $rootScope.selected = selectedItem;
                }, function () {
                $log.info('Modal dismissed at: ' + new Date());
               });
              },
          showModalData : function(data,itemid){
            $rootScope.showmodalinfo['url'] = data.url;
            $rootScope.showmodalinfo['model'] = data.model;
            $rootScope.showmodalinfo['fields'] = data.fields;
            $rootScope.showmodalinfo['id'] = itemid;

              var modalInstance = $modal.open({
                templateUrl: 'components/modal/DisplayModal.html',
                controller: 'ModalDisplayInstanceCtrl'
              })
            },
          addModalData  : function(data){
            $rootScope.addmodalinfo['url'] = data.url;
            $rootScope.addmodalinfo['model'] = data.model;
            $rootScope.addmodalinfo['fields'] = data.fields;

              var modalInstance = $modal.open({
                templateUrl: 'components/modal/AddModal.html',
                controller: 'ModalAddInstanceCtrl'
              })
            },     
          editModalData : function(data,itemid){
            $rootScope.editmodalinfo['url'] = data.url;
            $rootScope.editmodalinfo['model'] = data.model;
            $rootScope.editmodalinfo['fields'] = data.fields;
            $rootScope.editmodalinfo['id'] = itemid;
              var modalInstance = $modal.open({
                templateUrl: 'components/modal/EditModal.html',
                controller: 'ModalEditInstanceCtrl'
              })
          },
          deleteModalData : function(data,itemid){
              $rootScope.deletemodalinfo['url']    = data.url;
              $rootScope.deletemodalinfo['model']  = data.model;
              $rootScope.deletemodalinfo['fields'] = data.fields;
              $rootScope.deletemodalinfo['id']     = itemid;
              var modalInstance = $modal.open({
                  templateUrl:'components/modal/DeleteModal.html',
                  controller:'ModalDeleteInstanceCtrl'
              })
            },      
        }
      })