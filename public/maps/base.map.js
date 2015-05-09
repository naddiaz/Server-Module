// FIXED PARAMS
// LOCATION = #{location} --> in .jade view
// NAME = #{name} --> in .jade view
RADIUS = 30;
LABELOPTIONS = {
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
STYLE =[
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];
//END FIXED PARAMS

function initialize() {
  var airport = getAirport(LOCATION,NAME);
  var edit_state = false;
  var mapOptions = {
    center: new google.maps.LatLng(airport.latitude,airport.longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: STYLE
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);

  var cells = getCells(LOCATION,NAME);
  for(i in cells){
    makeBeaconCircle(map,cells[i])
  }

  google.maps.event.addListener(map, 'mouseover', function (event) {
    if($('#sw_editmode').is(':checked')){
      map.setOptions({ draggableCursor : "url(https://raw.githubusercontent.com/naddiaz/Server-Module/refactor/public/images/cursoradd.png), auto" })
    }
    else{
      map.setOptions({ draggableCursor : "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default" })
    }
  });

  google.maps.event.addDomListener(map, "click", function (e) {
    if($('#sw_editmode').is(':checked')){
      var cell = {
        id_cell: getNextCellID(LOCATION,NAME),
        latitude: e.latLng.A,
        longitude: e.latLng.F,
        color: randColor()
      }
      makeBeaconCircle(map,cell);
      setCell(LOCATION,NAME,cell);
      var beacon = {
        id_cell: getNextCellID(LOCATION,NAME),
        id_beacon: getNextCellID(LOCATION,NAME),
      }
      setBeacon(LOCATION,NAME,beacon);
    }
  });

  $('#sw_editmode').change(function(){
    if($(this).is(':checked')){
      edit_state = true;
      $('#map_edit_state').html('Se ha activado la edición');
    }
    else if(edit_state){
      edit_state = false;
      $('#map_edit_state').html('La edición no está activada');
      makeGraph(LOCATION,NAME,RADIUS);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function makeBeaconCircle(map,cell){
  

  paths_cell = new google.maps.LatLng(cell.latitude, cell.longitude);
  
  cell_map = new google.maps.Circle({
    center: paths_cell,
    radius: RADIUS,
    strokeColor: "#"+cell.color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#"+cell.color,
    fillOpacity: 0.15,
    indexID: cell.id_cell
  });

  cell_map.setMap(map);
  
  var labelText = "Celda: " + cell.id_cell;

  LABELOPTIONS.content = labelText;
  LABELOPTIONS.position = paths_cell;

  var label = new InfoBox(LABELOPTIONS);
  label.open(map);

  google.maps.event.addListener(cell_map, 'click', function (event) {
      $("#cell").val(this.indexID);
      $("#cell_hide").val(this.indexID);
      $("input[id^='cell_edit_']").val(this.indexID);
      $("input[id^='cell_edit_hide_']").val(this.indexID);
      if($('#sw_editmode').is(':checked')){
        confirmDelete(this,label,LOCATION,NAME,this.indexID)
      }
  });

  google.maps.event.addListener(cell_map, 'mouseover', function (event) {
    if($('#sw_editmode').is(':checked')){
      this.setOptions({ cursor : "url(https://raw.githubusercontent.com/naddiaz/Server-Module/refactor/public/images/eraser-icon.png), auto" })
    }
    else{
      this.setOptions({ cursor : "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default" })
    }
  });

  google.maps.event.addListener(cell_map, 'mouseover', function (event) {
    if($('#sw_editmode').is(':checked')){
      this.setOptions({ cursor : "url(http://megaicons.net/static/img/icons_sizes/151/1160/32/eraser-icon.png), auto" })
    }
    else{
      this.setOptions({ cursor : "url(https://maps.gstatic.com/mapfiles/openhand_8_8.cur), default" })
    }
  });
}

function confirmDelete(cell_map,label,location,name,id) {

  var id = $.gritter.add({
    title: "Confirmación",
    text: "<h3>¿Desea eliminar la celda <b>" + id + "</b>?</h3><button id=\"removeCell\" class=\"btn btn-danger\">Eliminar<span id=\""+id+"\"></span></button><button id=\"cancelremoveCell\" class=\"btn btn-primary\">Cancelar</button>",
    sticky: true,
    class_name: 'gritter-alert-warning'
  });

  $('#removeCell').click(function(){
    var idCell = $(this).find('span').attr('id');
    deleteCell(LOCATION,NAME,{id_cell: idCell});
    deleteBeacon(LOCATION,NAME,{id_beacon: idCell});
    cell_map.setMap(null);
    label.setVisible(false);
    $.gritter.removeAll();
  });
  $('#cancelremoveCell').click(function(){
    $.gritter.removeAll();
  });
}

$(window).bind('beforeunload', function(e) {
  if($('#sw_editmode').is(':checked')){
    edit_state = false;
    $('#sw_editmode').attr('checked', false);
    makeGraph(LOCATION,NAME,RADIUS);
  }
});

function randColor(){
  // #CCCCCC to #222222
  return Math.floor(Math.random() * (13421772 - 2236962) + 2236962).toString(16);
}
