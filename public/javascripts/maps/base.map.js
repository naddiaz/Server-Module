function initialize() {
  
  var mapOptions = {
    center: new google.maps.LatLng(airport.center.latitude,airport.center.longitude),
    zoom: airport.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);

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

  for(i in airport.cells){
    paths_cell = new google.maps.LatLng(airport.cells[i].path[0], airport.cells[i].path[1]);
    
    cell = new google.maps.Circle({
      center: paths_cell,
      radius: 20,
      strokeColor: airport.cells[i].color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: airport.cells[i].color,
      fillOpacity: 0.35,
      indexID: "cell_" + i
    });

    cell.setMap(map);

    google.maps.event.addListener(cell, 'click', function (event) {
        $("#cell").val(this.indexID);
        $("#cell_hide").val(this.indexID);
        $("input[id^='cell_edit_']").val(this.indexID);
        $("input[id^='cell_edit_hide_']").val(this.indexID);
    });
    
    var labelText = "cell_" + i;

    labelOptions.content = labelText;
    labelOptions.position = paths_cell;

    var label = new InfoBox(labelOptions);
    label.open(map);

    google.maps.event.addListener(cell, 'center_changed', function () {
        label.setPosition(cell.getCenter());
    });
  }
}

function randColor(){
  // #CCCCCC to #222222
  return Math.floor(Math.random() * (13421772 - 2236962) + 2236962).toString(16);
}

google.maps.event.addDomListener(window, 'load', initialize);