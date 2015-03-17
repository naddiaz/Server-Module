$(document).ready(function(){
  history(LOCATION,NAME);
  $('#map_refresh').click(function(){
    history(LOCATION,NAME);
  })
});

function history(location, name){
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
      var beacons = new Array()
      for(i in data)
        beacons.push({position:beaconToLatLon(location,name,data[i].id_beacon),frequency:data[i].frequency});
      console.log(beacons);
      initialize(beacons)
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
