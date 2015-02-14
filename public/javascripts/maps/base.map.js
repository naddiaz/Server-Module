function initialize() {
  
  var mapOptions = {
    center: new google.maps.LatLng(airport.center.latitude,airport.center.longitude),
    zoom: airport.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);

  for(i in airport.cells){
    makeBeaconCircle(map,airport.cells[i])
  }

  google.maps.event.addDomListener(map, "click", function (e) {
    //lat and lng is available in e object
    var latLng = e.latLng;
    console.log(latLng);
    var cell = {
      id: airport.cells.length,
      path: [e.latLng.k,e.latLng.D],
      color: '#'+randColor()
    }
    console.log(cell);
    makeBeaconCircle(map,cell);
  });
}

function makeBeaconCircle(map,cell){
  var labelOptions = {
      boxStyle: {
          background: '#FFFFFF',
          textAlign: "center",
          fontSize: "10pt",
          width: "90px"
      },
      disableAutoPan: true,
      pixelOffset: new google.maps.Size(-45, 0),
      closeBoxURL: "",
      isHidden: false,
      pane: "mapPane",
      enableEventPropagation: true
  };

  paths_cell = new google.maps.LatLng(cell.path[0], cell.path[1]);
  
  cell_map = new google.maps.Circle({
    center: paths_cell,
    radius: 20,
    strokeColor: cell.color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: cell.color,
    fillOpacity: 0.35,
    indexID: "cell_" + cell.id
  });

  cell_map.setMap(map);

  google.maps.event.addListener(cell_map, 'click', function (event) {
      $("#cell").val(this.indexID);
      $("#cell_hide").val(this.indexID);
      $("input[id^='cell_edit_']").val(this.indexID);
      $("input[id^='cell_edit_hide_']").val(this.indexID);
  });
  
  var labelText = "cell_" + cell.id;

  labelOptions.content = labelText;
  labelOptions.position = paths_cell;

  var label = new InfoBox(labelOptions);
  label.open(map);

  google.maps.event.addListener(cell_map, 'center_changed', function () {
      label.setPosition(cell_map.getCenter());
  });
}

function randColor(){
  // #CCCCCC to #222222
  return Math.floor(Math.random() * (13421772 - 2236962) + 2236962).toString(16);
}

google.maps.event.addDomListener(window, 'load', initialize);