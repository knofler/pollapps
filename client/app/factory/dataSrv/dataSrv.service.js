'use strict';

angular.module('poll')
 .service('dataSrv', function ($http) {
    var Reddit = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Reddit.prototype.nextPage = function() {
    console.log("As long as next page got called")
    if (this.busy) return;
    this.busy = true;
    console.log("this.after" , this.after)
    // var url = "http://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
    $http.get('/api/scrolls/').success(function(data) {
      var items = data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      // this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Reddit;
  });


