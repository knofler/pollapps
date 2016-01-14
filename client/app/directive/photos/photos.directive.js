'use strict';

angular.module('poll')
  .directive('photos', function ($http,socket) {
    return {
      templateUrl: 'app/directive/photos/photos.html',
      restrict: 'EA',
       scope:{
       uploader   :'=',
       multiple : '='
      },
      link: function (scope, element, attrs) {

        console.log("scope.upload in photos directive is :: ", scope.uploader);

        // FILTERS

        scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        // scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        //     console.info('onWhenAddingFileFailed', item, filter, options);
        // };
        // scope.uploader.onAfterAddingFile = function(fileItem) {
        //     console.info('onAfterAddingFile', fileItem);
        // };
        // scope.uploader.onAfterAddingAll = function(addedFileItems) {
        //     console.info('onAfterAddingAll', addedFileItems);
        // };
        // scope.uploader.onBeforeUploadItem = function(item) {
        //     console.info('onBeforeUploadItem', item);
        // };
        // scope.uploader.onProgressItem = function(fileItem, progress) {
        //     console.info('onProgressItem', fileItem, progress);
        // };
        // scope.uploader.onProgressAll = function(progress) {
        //     console.info('onProgressAll', progress);
        // };
        // scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //     console.info('onSuccessItem', fileItem, response, status, headers);
        // };
        // scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
        //     console.info('onErrorItem', fileItem, response, status, headers);
        // };
        // scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
        //     console.info('onCancelItem', fileItem, response, status, headers);
        // };
        // scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
        //     console.info('onCompleteItem', fileItem, response, status, headers);
        // };
        // scope.uploader.onCompleteAll = function() {
        //     console.info('onCompleteAll');
        // };

        // console.info('uploader', uploader);

        //Get image info from DB and display
       $http.get('/api/uploads/').success(function(data){
            scope.imageData = data;
            socket.syncUpdates('upload', scope.imageData);
        });
      }
    };
  });