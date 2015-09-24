STYLE =[
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];
var isGraphShow = false;
var isBeaconsArea = true;
function initialize() {
  var installation = getInstallationById(ID_INSTALLATION);
  var circlesBeacons = [];
  var polylineAdjacent = [];
  var mapOptions = {
    center: new google.maps.LatLng(installation.location.latitude,installation.location.longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: STYLE
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
  loadBeacons(map,circlesBeacons,polylineAdjacent);
  mapClickEvent(map,circlesBeacons,polylineAdjacent);


  window.document.getElementById("mapToggleCircleArea").addEventListener("click",function(){
    if(!isBeaconsArea){
      showCirclesArea(circlesBeacons);
    }
    else{
      hideCirclesArea(circlesBeacons);
    }
  });

  window.document.getElementById("mapToggleGraphLines").addEventListener("click",function(){
    if(!isGraphShow){
      addAdjacentPolyline(circlesBeacons,polylineAdjacent);
    }
    else{
      removeAdjacentPolyline(circlesBeacons,polylineAdjacent);
    }
  });

  window.document.getElementById("mapSaveGraph").addEventListener("click",function(){
    saveBeaconsAdjacentsAndDistances(circlesBeacons);
  });

  refreshBoxGroups();
}

google.maps.event.addDomListener(window, 'load', initialize);

function refreshBoxGroups(){
  document.getElementById("groupColor").addEventListener("change", function(){
    var color = this.value;
    this.style.background = "#" + color;
  });
}

function saveBeaconsAdjacentsAndDistances(circlesBeacons){
  var beacons = [];
  for(var i=0; i<circlesBeacons.length; i++){
    coords = translateLatLng(circlesBeacons[i].center.getCenter());
    beacon = {
      id_beacon: circlesBeacons[i].center.mac,
      location: {
        latitude: coords.lat,
        longitude: coords.lng
      },
      group: {
        id: circlesBeacons[i].center.group,
        color: circlesBeacons[i].center.fillColor
      },
      adjacent: []
    };
    if(circlesBeacons[i].center.getMap() != null){
      for(var j=0; j<circlesBeacons.length; j++){
        if(circlesBeacons[j].center.getMap() != null && i!=j && circlesBeacons[i].center.group == circlesBeacons[j].center.group){
          var distance = distanceBetweenTwoPoints(circlesBeacons[i].center.getCenter(),circlesBeacons[j].center.getCenter());
          if(distance < 30){
            beacon.adjacent.push({
              id_beacon: circlesBeacons[j].center.mac,
              distance: distance
            })
          }
        }
      }
      beacons.push(beacon);
    }
  }
  saveBeacons(beacons);
}

function saveBeacons(beacons){
  var data = {
    beacons: beacons,
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/map/saveBeacons",
    type:"POST",
    data: data,
    success:function(req) {
    }
  });
}

function loadBeacons(map,circlesBeacons,polylineAdjacent){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/map/loadBeacons",
    type:"POST",
    data: data,
    success:function(req) {
      console.log(req);
      for(var i=0; i<req.beacons.length; i++){
        paintBeaconsFromDatabase(map,i,req.beacons[i],circlesBeacons,polylineAdjacent)
      }
      checkAdjacents(circlesBeacons);
      hideCirclesArea(circlesBeacons);
      addAdjacentPolyline(circlesBeacons,polylineAdjacent);
    }
  });
}

function mapClickEvent(map,circlesBeacons,polylineAdjacent){
  google.maps.event.addListener(map, "click", function(e) {
    coords = translateLatLng(e.latLng)
    paintBeaconCircle(map,coords.lat,coords.lng,circlesBeacons,polylineAdjacent);
    if(!isBeaconsArea){
      showCirclesArea(circlesBeacons);
      hideCirclesArea(circlesBeacons);
    }
  });
}

function defineBeaconAddress(beacon) {
  var id = $.gritter.add({
    title: "Beacon MAC address",
    text: "<input id='macAddress' type='text'><button id='macAddressButton' class='btn btn-success'>OK</button>",
    sticky: true,
    class_name: 'gritter-alert-warning'
  });

  $('#macAddressButton').click(function(){
    var mac = $('#macAddress').val();
    beacon.setOptions({mac: mac});
    $.gritter.removeAll();
  });
}

function paintBeaconsFromDatabase(map,id,beacon,circlesBeacons,polylineAdjacent){
  var center = new google.maps.LatLng(beacon.location.latitude,beacon.location.longitude);
  var circleAreaData = {
    strokeColor: '#F44336',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#F44336',
    fillOpacity: 0.1,
    map: map,
    center: center,
    radius: 30,
    id: id,
    group: beacon.group.id
  };
  var circleCenterData = {
    strokeWeight: 0,
    fillColor: beacon.group.color,
    fillOpacity: 1,
    map: map,
    center: center,
    radius: 3,
    draggable: true,
    zIndex:10000,
    id: id,
    group: beacon.group.id,
    mac: beacon.id_beacon
  };
  addCirclesEvents(circleAreaData,circleCenterData,circlesBeacons,polylineAdjacent);
}

function paintBeaconCircle(map,latitude,longitude,circlesBeacons,polylineAdjacent){
  var groupId = document.getElementById("groupId").value;
  var groupColor = document.getElementById("groupColor").value;
  var center = new google.maps.LatLng(latitude,longitude);
  var circleAreaData = {
    strokeColor: '#F44336',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#F44336',
    fillOpacity: 0.1,
    map: map,
    center: center,
    radius: 30,
    id: circlesBeacons.length,
    group: groupId
  };
  var circleCenterData = {
    strokeWeight: 0,
    fillColor: '#' + groupColor,
    fillOpacity: 1,
    map: map,
    center: center,
    radius: 3,
    draggable: true,
    zIndex:10000,
    id: circlesBeacons.length,
    group: groupId
  };
  addCirclesEvents(circleAreaData,circleCenterData,circlesBeacons,polylineAdjacent);
  defineBeaconAddress(circleCenter);
}

function addCirclesEvents(circleAreaData,circleCenterData,circlesBeacons,polylineAdjacent){
  circleArea = new google.maps.Circle(circleAreaData);
  circleCenter = new google.maps.Circle(circleCenterData);
  circlesBeacons.push({area:circleArea,center: circleCenter});

  google.maps.event.addListener(circleCenter, "center_changed", function(e) {
    circlesBeacons[this.id].area.setCenter(this.getCenter());
    removeAdjacentPolyline(circlesBeacons,polylineAdjacent);
    checkAdjacents(circlesBeacons);
    addAdjacentPolyline(circlesBeacons,polylineAdjacent);
  });

  google.maps.event.addListener(circleCenter, "rightclick", function(e) {
    this.setMap(null);
    circlesBeacons[this.id].area.setMap(null);
    removeAdjacentPolyline(circlesBeacons,polylineAdjacent);
    refreshBeaconsIds(circlesBeacons);
    checkAdjacents(circlesBeacons);
    addAdjacentPolyline(circlesBeacons,polylineAdjacent);
  });

  google.maps.event.addListener(circleCenter, "click", function(e) {
    var infoString = "<div><h3>Beacon data:</h3><ul>";
    infoString += "<li>MAC address: " + this.mac + "</li>";
    infoString += "<li>Cluster: " + this.group + "</li>";
    infoString += "<li>Cluster Color: " + this.fillColor + "</li>";
    infoString += infoAdjacents(this,circlesBeacons);
    infoString += "</ul></div>";
    var infowindow = new google.maps.InfoWindow({
      content: infoString,
      position: this.getCenter()
    });
    infowindow.open(this.getMap(),this);
  });
}

function infoAdjacents(beacon,circlesBeacons){
  var str = "";
  for(var j=0; j<circlesBeacons.length; j++){
    if(circlesBeacons[j].center.getMap() != null && beacon.id!=j && beacon.group == circlesBeacons[j].center.group){
      var distance = distanceBetweenTwoPoints(beacon.getCenter(),circlesBeacons[j].center.getCenter());
      if(distance < 30){
        str += "<li>Adjacent: " + circlesBeacons[j].center.mac + ", Distance: " + distance + " m.</li>";
      }
    }
  }
  return str;
}

function checkAdjacents(circlesBeacons){
  for(var i=0; i<circlesBeacons.length; i++){
    var anyAdjacent = 0;
    if(circlesBeacons[i].center.getMap() != null){
      for(var j=0; j<circlesBeacons.length; j++){
        if(circlesBeacons[j].center.getMap() != null && i!=j && circlesBeacons[i].center.group == circlesBeacons[j].center.group){
          if(distanceBetweenTwoPoints(circlesBeacons[i].center.getCenter(),circlesBeacons[j].center.getCenter()) < 30){
            anyAdjacent += 1;
            if(anyAdjacent == 1)
              circlesBeacons[i].area.setOptions({fillColor: '#FFC107', strokeColor: '#FFC107'});
            if(anyAdjacent >= 2)
              circlesBeacons[i].area.setOptions({fillColor: '#8BC34A', strokeColor: '#8BC34A'});
          }
          else if(anyAdjacent == 0){
            circlesBeacons[i].area.setOptions({fillColor: '#F44336', strokeColor: '#F44336'});
          }
        }
      }
    }
  }
}

function refreshBeaconsIds(circlesBeacons){
  var active = [];
  for(var i=0; i<circlesBeacons.length; i++){
    if(circlesBeacons[i].center.getMap() != null){
      active.push(i);
    }
  }
  if(active.length == 1){
    circlesBeacons[active[0]].area.setOptions({fillColor: '#F44336', strokeColor: '#F44336'});
  }
}

function showCirclesArea(circlesBeacons){
  isBeaconsArea = true;
  for(var i=0; i<circlesBeacons.length; i++){
    var map = circlesBeacons[i].center.getMap();
    if(circlesBeacons[i].area.isBeacon){
      circlesBeacons[i].area.setMap(map);
    }
  }
}

function hideCirclesArea(circlesBeacons){
  isBeaconsArea = false;
  for(var i=0; i<circlesBeacons.length; i++){
    if(circlesBeacons[i].area.getMap() != null){
      circlesBeacons[i].area.setOptions({isBeacon: true});
      circlesBeacons[i].area.setMap(null);
    }
    else{
      circlesBeacons[i].area.setOptions({isBeacon: false});
    }
  }
}

function addAdjacentPolyline(circlesBeacons,polylineAdjacent){
  isGraphShow = true;
  for(var i=0; i<circlesBeacons.length; i++){
    var anyAdjacent = 0;
    if(circlesBeacons[i].center.getMap() != null){
      for(var j=0; j<circlesBeacons.length; j++){
        if(circlesBeacons[j].center.getMap() != null && i!=j && circlesBeacons[i].center.group == circlesBeacons[j].center.group){
          if(distanceBetweenTwoPoints(circlesBeacons[i].center.getCenter(),circlesBeacons[j].center.getCenter()) < 30){
            polylineAdjacent.push(
              addPolylineFromPoints(
                circlesBeacons[i].center.getMap(),
                circlesBeacons[i].center.getCenter(),
                circlesBeacons[j].center.getCenter()
              )
            );
          }
        }
      }
    }
  }
}

function removeAdjacentPolyline(circlesBeacons,polylineAdjacent){
  isGraphShow = false;
  for(var i=0; i<polylineAdjacent.length; i++){
    polylineAdjacent[i].setMap(null); 
  }
  polylineAdjacent = [];
}

function addPolylineFromPoints(map,A,B){
  var lineAdjacentPoints = [A,B];
  var polyline = new google.maps.Polyline({
    path: lineAdjacentPoints,
    geodesic: true,
    strokeColor: '#5C6BC0',
    strokeOpacity: 1.0,
    strokeWeight: 1
  });
  polyline.setMap(map);
  return polyline;
}
