(function(){
  var app = angular.module('aMap', ['ngMap']);
 
  app.controller('MapCtrl', function (){
                  
        this.center = {
          latitude: 28,
          longitude: -16
        };
        this.zoom = 6;

      this.location = function(){
        return this.center.latitude + "," + this.center.longitude;
      }
  });
})();