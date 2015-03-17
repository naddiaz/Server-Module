$(document).ready(function(){
  var airport = getAirport(LOCATION,NAME);
  var mapOptions = {
    center: new google.maps.LatLng(airport.latitude,airport.longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: STYLE
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);

  history(LOCATION,NAME,map);

  var state = true;
  $('#map_refresh').click(function(){
    history(LOCATION,NAME, map);
  });
  $('#hot_zone').click(function(){
    if(state)
      state = false
    else
      state = true;
    view_hot_zone(state, map);
  });
});

function history(location, name,map){
  var data = {
    location: location,
    name: name,
    id_person: $('#id_person').attr('data')
  }
  $.ajax({
    url:"/localizations/history",
    type:"POST",
    data: data,
    success:function(data) {
      var beacons = new Array();
      var hot = new Array();
      for(i in data.sig_points)
        beacons.push({position:beaconToLatLon(location,name,data.sig_points[i].id_beacon),frequency:data.sig_points[i].frequency});
      for(i in data.hot_points)
        hot.push({position:beaconToLatLon(location,name,data.hot_points[i].id_beacon),frequency:data.hot_points[i].frequency});
      trace_beacons(beacons,map)
      setTimeout(function(){
        hot_beacons_map(hot,map);
      },(beacons.length-1)*750);
    }
  });
}

function beaconToLatLon(location, name, beacon){
  var data = {
    location: location,
    name: name,
    id_beacon: beacon
  }
  var position = null;
  $.ajax({
    url:"/localizations/beaconToLatLon",
    type:"POST",
    data: data,
    async: false,
    success:function(data) {
      position = data;
    }
  });
  return position;
}
