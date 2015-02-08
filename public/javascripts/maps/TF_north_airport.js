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
          path: [28.488213,-16.347496],
          color: '#F44336'
      },
      {
          cell: "1",
          path: [28.487901,-16.347633],
          color: '#9C27B0'
      },
      {
          cell: "2",
          path: [28.48797,-16.347287],
          color: '#3F51B5'
      },
      {
          cell: "3",
          path: [28.487675,-16.347359],
          color: '#8BC34A'
      },
      {
          cell: "4",
          path: [28.488017,-16.346965],
          color: '#FF9800'
      },
      {
          cell: "5",
          path: [28.487741,-16.347045],
          color: '#69F0AE'
      }
    ]
  };

  var mapOptions = {
    center: new google.maps.LatLng(airport.center.latitude,airport.center.longitude),
    zoom: airport.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);

  for(i in airport.cells){
    paths_cell = new google.maps.LatLng(airport.cells[i].path[0], airport.cells[i].path[1]);
    
    cell = new google.maps.Circle({
      center: paths_cell,
      radius: 20,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: airport.cells[i].color,
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

function randColor(){
  // #CCCCCC to #222222
  return Math.floor(Math.random() * (13421772 - 2236962) + 2236962).toString(16);
}

google.maps.event.addDomListener(window, 'load', initialize);