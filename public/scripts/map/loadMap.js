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
  var installation = getInstallationById(ID_INSTALATION);
  var circlesBeacons = [];
  var polylineAdjacent = [];
  var mapOptions = {
    center: new google.maps.LatLng(installation.location.latitude,installation.location.longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: STYLE
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
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
}
google.maps.event.addDomListener(window, 'load', initialize);

function mapClickEvent(map,circlesBeacons,polylineAdjacent){
  google.maps.event.addListener(map, "click", function(e) {
    paintBeaconCircle(map,e.latLng.A,e.latLng.F,circlesBeacons,polylineAdjacent);
    if(!isBeaconsArea){
      showCirclesArea(circlesBeacons);
      hideCirclesArea(circlesBeacons);
    }
  });
}

function paintBeaconCircle(map,latitude,longitude,circlesBeacons,polylineAdjacent){
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
    id: circlesBeacons.length
  };
  var circleCenterData = {
    strokeWeight: 0,
    fillColor: '#3F51B5',
    fillOpacity: 1,
    map: map,
    center: center,
    radius: 3,
    draggable: true,
    zIndex:10000,
    id: circlesBeacons.length
  };
  circleArea = new google.maps.Circle(circleAreaData);
  circleCenter = new google.maps.Circle(circleCenterData);
  circlesBeacons.push({area:circleArea,center: circleCenter});

  google.maps.event.addListener(circleCenter, "center_changed", function(e) {
    circlesBeacons[this.id].area.setCenter(this.getCenter());
    removeAdjacentPolyline(circlesBeacons,polylineAdjacent);
    checkAdjacents(circlesBeacons);
    addAdjacentPolyline(circlesBeacons,polylineAdjacent);
  });

  google.maps.event.addListener(circleArea, "rightclick", function(e) {
    this.setMap(null);
    circlesBeacons[this.id].center.setMap(null);
    removeAdjacentPolyline(circlesBeacons,polylineAdjacent);
    refreshBeaconsIds(circlesBeacons);
    checkAdjacents(circlesBeacons);
    addAdjacentPolyline(circlesBeacons,polylineAdjacent);
  });
}

function checkAdjacents(circlesBeacons){
  for(var i=0; i<circlesBeacons.length; i++){
    var anyAdjacent = 0;
    if(circlesBeacons[i].center.getMap() != null){
      for(var j=0; j<circlesBeacons.length; j++){
        if(circlesBeacons[j].center.getMap() != null && i!=j){
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
    console.log(circlesBeacons[i].area.isBeacon)
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
        if(circlesBeacons[j].center.getMap() != null && i!=j){
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

function distanceBetweenTwoPoints(pointA,pointB){
  rad = function(x) {
    return x*Math.PI/180;
  }

  var R     = 6378.137;
  var dLat  = rad( pointB.A - pointA.A );
  var dLong = rad( pointB.F - pointA.F );

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(pointA.A)) * Math.cos(rad(pointB.A)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return (d * 1000).toFixed(6);
}