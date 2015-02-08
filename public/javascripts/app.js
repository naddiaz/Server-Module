(function(){
  var app = angular.module('aMap', ['ngMap']);
 
  app.controller('MapCtrl', function ($scope){
      this.airport = {
        name: "Aeropuerto de los Rodeos",
        center: {
          latitude: 28.487678,
          longitude: -16.346519
        },
        zoom: 19,
        cells: [
          {
              cell: "0",
              path: [[28.488214,-16.347497],[28.487897,-16.347632],[28.487612,-16.346793],[28.487918,-16.34666]]
          },
          {
              cell: "1",
              path: [[28.487797,-16.347412],[28.487574,-16.346735],[28.487379,-16.346836],[28.487579,-16.347367],[28.487645,-16.347344]]
          },
          {
              cell: "2",
              path: [[28.487749,-16.346565],[28.488029,-16.346302],[28.488107,-16.346551]]
          }
        ],
        cells_properties: {
          name: "polygon",
          geodesic: "true",
          stroke_color: "#FF0000",
          stroke_opacity: "1.0",
          stroke_weight: "2",
          clickable: "true"
        }
      };

      $scope.cell = {value: 0};

      this.location = function(){
        return this.airport.center.latitude + "," + this.airport.center.longitude;
      }

      $scope.click_cell = function(event){
        $("#cell").val(this.id);
      }
  });
})();