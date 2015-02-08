function initialize() {
  var airport = {
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

  var mapOptions = {
    center: new google.maps.LatLng(airport.center.latitude,airport.center.longitude),
    zoom: airport.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);

  for(i in airport.cells){
    paths_cell = [];
    for(j in airport.cells[i].path){
      paths_cell.push(new google.maps.LatLng(airport.cells[i].path[j][0], airport.cells[i].path[j][1]));
    }
    cell = new google.maps.Polygon({
      paths: paths_cell,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      indexID: "cell_" + i
    });

    cell.setMap(map);
    google.maps.event.addListener(cell, 'click', function (event) {
        console.log(this.indexID);
        $("#cell").val(this.indexID);
        $("#cell_hide").val(this.indexID);
    });
  }
}
google.maps.event.addDomListener(window, 'load', initialize);