function initialize() {
  var airport = getAirport(LOCATION,NAME);
  var style =[
      {
          featureType: "poi",
          elementType: "labels",
          stylers: [
                { visibility: "off" }
          ]
      }
  ];
  var mapOptions = {
    center: new google.maps.LatLng(airport.latitude,airport.longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: style
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);

  var cells = getCells(LOCATION,NAME);
  for(i in cells){
    makeBeaconCircle(map,cells[i])
  }

  google.maps.event.addListener(map, 'mouseover', function (event) {
    if($('#sw_editmode').is(':checked')){
      map.setOptions({ draggableCursor : "url(https://raw.githubusercontent.com/naddiaz/Server-Module/beaconsAddDynamic/public/images/cursor_edit.png), auto" })
    }
    else{
      map.setOptions({ draggableCursor : "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default" })
    }
  });

  google.maps.event.addDomListener(map, "click", function (e) {
    if($('#sw_editmode').is(':checked')){
      var cell = {
        id_cell: getNextCellID(LOCATION,NAME),
        latitude: e.latLng.k,
        longitude: e.latLng.D,
        color: randColor()
      }
      makeBeaconCircle(map,cell);
      setCell(LOCATION,NAME,cell);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function getAirport(location,name){
  var airport;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/airport/info",
    async: false,
    type:"POST",
    success:function(data) {
      airport = data; 
    }
  });
  return airport;
}

function getCells(location,name){
  var cells;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cells/info",
    async: false,
    type:"POST",
    success:function(data) {
      cells = data; 
    }
  });
  return cells;
}

function getNextCellID(location,name){
  var id;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cell/next",
    async: false,
    type:"POST",
    success:function(data) {
      id = data.id_cell; 
      console.log(id)
    }
  });
  return id;
}

function setCell(location,name,cell){
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cell/create",
    type:"POST",
    data: cell
  });
}

function deleteCell(location,name,cell){
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cell/delete",
    type:"POST",
    data: cell
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

  paths_cell = new google.maps.LatLng(cell.latitude, cell.longitude);
  
  cell_map = new google.maps.Circle({
    center: paths_cell,
    radius: 20,
    strokeColor: "#"+cell.color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#"+cell.color,
    fillOpacity: 0.35,
    indexID: cell.id_cell
  });

  cell_map.setMap(map);
  
  var labelText = "celda: " + cell.id_cell;

  labelOptions.content = labelText;
  labelOptions.position = paths_cell;

  var label = new InfoBox(labelOptions);
  label.open(map);

  google.maps.event.addListener(cell_map, 'click', function (event) {
      $("#cell").val(this.indexID);
      $("#cell_hide").val(this.indexID);
      $("input[id^='cell_edit_']").val(this.indexID);
      $("input[id^='cell_edit_hide_']").val(this.indexID);
      if($('#sw_editmode').is(':checked')){
        var r = confirm("Desea eliminar la celda: " + this.indexID);
        if (r == true) {
            deleteCell(LOCATION,NAME,{id_cell: this.indexID});
            this.setMap(null);
            label.setVisible(false);
        }
      }
  });
}

function randColor(){
  // #CCCCCC to #222222
  return Math.floor(Math.random() * (13421772 - 2236962) + 2236962).toString(16);
}
