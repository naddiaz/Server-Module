STYLE =[
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

var circlesBeacons = [];
var circlesEmployees = [];
var polylineDistance = [];
var selectedPoint = null;
var centerSelected = null;
var lowCluster = 100;
var highCluster = -100;

function initialize() {
  var installation = getInstallationById(ID_INSTALLATION);
  var mapOptions = {
    center: new google.maps.LatLng(installation.location.latitude,installation.location.longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    mapTypeControl: false,
    scrollwheel: false,
    styles: STYLE
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
  mapClickEvent(map,circlesBeacons);
  loadBeacons(map);
  loadEmployees(map);
  $('#prevCluster').click(function(){
    var cluster = parseInt($('#cluster').val())-1;
    if(lowCluster <= cluster){
      $('#cluster').val(cluster);
      showCluster(map,cluster);
      calculateMinMaxDistances(map,cluster);
    }
  });
  $('#nextCluster').click(function(){
    var cluster = parseInt($('#cluster').val())+1;
    if(highCluster >= cluster){
      $('#cluster').val(cluster);
      showCluster(map,cluster);
      calculateMinMaxDistances(map,cluster);
    }
  });
  $("#categories").change(function(){
    var category = $(this).val();
    for(var i=0; i<circlesEmployees.length; i++){
      if(circlesEmployees[i] != null){
        if(circlesEmployees[i].category == category){
          circlesEmployees[i].setMap(map);
        }
        else{
          circlesEmployees[i].setMap(null);
        }
      }
    }
  });
}
google.maps.event.addDomListener(window, 'load', initialize);

function mapClickEvent(map){
  google.maps.event.addListener(map, "click", function(e) {
    paintBeaconCircle(map,e.latLng.lat(),e.latLng.lng());
    $('#location').val("{\"lat\":" + e.latLng.lat() + ",\"lng\":" + e.latLng.lng() +"}");
    centerSelected = new google.maps.LatLng(e.latLng.lat(),e.latLng.lng());
    var cluster = parseInt($('#cluster').val());
    calculateMinMaxDistances(map,cluster);
  });
}

function paintBeaconCircle(map,latitude,longitude){
  var center = new google.maps.LatLng(latitude,longitude);
  if(selectedPoint != null){
    selectedPoint.setCenter(center);
  }
  else{
    var circleCenterData = {
      strokeWeight: 0,
      fillColor: '#e725e0',
      fillOpacity: 1,
      map: map,
      center: center,
      radius: 1,
      zIndex:10000
    };
    selectedPoint = new google.maps.Circle(circleCenterData);
  }
}

function paintBeaconCircleFromDatabase(beacon){
  var center = new google.maps.LatLng(beacon.location.latitude,beacon.location.longitude);
  var circleCenterData = {
    strokeWeight: 0,
    fillColor: beacon.group.color,
    fillOpacity: 1,
    center: center,
    radius: 2,
    group: beacon.group.id
  };
  circleBeacon = new google.maps.Circle(circleCenterData);
  circlesBeacons.push(circleBeacon);
}

function paintEmployeeCircleFromDatabase(employee){
  if(employee.track.length > 0){
    var center = new google.maps.LatLng(employee.track[0].location.latitude,employee.track[0].location.longitude);
    var circleCenterData = {
      strokeWeight: 0,
      fillColor: '#00C853',
      fillOpacity: 1,
      center: center,
      radius: 1,
      category: employee.category
    };
    circlesEmployee = new google.maps.Circle(circleCenterData);
    google.maps.event.addListener(circlesEmployee, "click", function(e) {
      var infoString = "<div><h3>Employee Information</h3><ul>";
      infoString += "<li>Id: " + employee.id_employee + "</li>";
      infoString += "<li>Name: " + employee.name + "</li>";
      infoString += "<li>Last Name: " + employee.last_name + "</li>";
      infoString += "<li>Category: " + employee.category + "</li>";
      infoString += "</ul></div>";
      var infowindow = new google.maps.InfoWindow({
        content: infoString,
        position: this.getCenter()
      });
      infowindow.open(this.getMap(),this);
    });
    circlesEmployees.push(circlesEmployee);
  }
  else{
    circlesEmployees.push(null);
  }
}


function addPolylineFromPoints(map,A,B){
  var distancePoints = [A,B];
  var polyline = new google.maps.Polyline({
    path: distancePoints,
    geodesic: true,
    strokeColor: '#5C6BC0',
    strokeOpacity: 1.0,
    strokeWeight: 1,
    zIndex:9000
  });
  polyline.setMap(map);
  polylineDistance.push(polyline);
}

function loadBeacons(map){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/map/loadBeacons",
    type:"POST",
    data: data,
    success:function(req) {
      for(var i=0; i<req.beacons.length; i++){
        paintBeaconCircleFromDatabase(req.beacons[i]);
        if(req.beacons[i].group.id == 1){
          circlesBeacons[i].setMap(map);
        }
        if(lowCluster >= req.beacons[i].group.id){
          lowCluster = req.beacons[i].group.id;
        }
        if(highCluster <= req.beacons[i].group.id){
          highCluster = req.beacons[i].group.id;
        }
      }
    }
  });
}

function calculateMinMaxDistances(map,cluster){
  var minDistance = 100000;
  var maxDistance = 0;
  var minNodeCenter = null;
  var maxNodeCenter = null;
  for(var i=0; i<circlesBeacons.length; i++){
    if(circlesBeacons[i].group == cluster){
      var distance = distanceBetweenTwoPoints(circlesBeacons[i].getCenter(),centerSelected);
      if(parseFloat(minDistance) > parseFloat(distance)){
        minDistance = distance;
        minNodeCenter = circlesBeacons[i].getCenter();
      }
      if(parseFloat(maxDistance) <= parseFloat(distance)){
        maxDistance = distance;
        maxNodeCenter = circlesBeacons[i].getCenter();
      }
    }
  }
  clearDistances();
  addPolylineFromPoints(map,centerSelected,minNodeCenter);
  addPolylineFromPoints(map,centerSelected,maxNodeCenter);
  $('#minDistance').html(minDistance + " m.");
  $('#maxDistance').html(maxDistance + " m.");
}

function clearDistances(){
  for(var i=0; i<polylineDistance.length; i++){
    polylineDistance[i].setMap(null);
  }
  polylineDistance = [];
}

function showCluster(map,cluster){
  for(var i=0; i<circlesBeacons.length; i++){
    if(circlesBeacons[i].group == cluster){
      circlesBeacons[i].setMap(map);
    }
    else{
      circlesBeacons[i].setMap(null);
    }
  }
}

function loadEmployees(map){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/map/loadEmployees",
    type:"POST",
    data: data,
    success:function(req) {
      var category = $("#categories").val();
      console.log(req.employees)
      for(var i=0; i<req.employees.length; i++){
        paintEmployeeCircleFromDatabase(req.employees[i]);
        if(req.employees[i].category == category){
          if(circlesEmployees[i] != null)
            circlesEmployees[i].setMap(map);
        }
      }
    }
  });
}