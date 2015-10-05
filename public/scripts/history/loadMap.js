STYLE =[
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

var trackPoints = [];
var nonImportant = [];
var map;

function outputUpdate(num) {
  num = (num < 10) ? '0'+num : num;
  document.querySelector('#output').value = num+':00';
  trackPointsVisibility(num);
  $("#important").prop("checked",false);
  $("#important").parent().removeClass("checked");
}


function trackPointsVisibility(num) {
  for(i in trackPoints){
    if(parseInt(trackPoints[i].hour) == parseInt(num)){
      trackPoints[i].setMap(map)
    }
    else{
      trackPoints[i].setMap(null)
    }
  }
}


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
  map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
  getTrack();
  var now = moment().format("DD/MM/YYYY");
  $("#map-date").html(now);
  $("#important").change(function(){
    if($(this).is( ":checked" )){
      findImportant();
    }
    else{
      showAll();
    }
  });
}
google.maps.event.addDomListener(window, 'load', initialize);

function getTrack(date){
  loadingBar('show');
  date = date || moment().format("DD/MM/YYYY");
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: ID_EMPLOYEE,
    date: date
  }
  $.ajax({
    url:"/helper/employees/tracking",
    type:"POST",
    data: data,
    success:function(req) {
      trackPoints = [];
      for(i in req.track){
        var track = req.track[i];
        var hour = moment(new Date(track.register_at)).format("HH");
        if(i == req.track.length-1){
          paintTrackPoint(track.location.latitude,track.location.longitude,hour,'last');
        }
        else{
          paintTrackPoint(track.location.latitude,track.location.longitude,hour);
        }
        trackPointsVisibility(0)
      }
      if(trackPoints.length > 0){
        map.setCenter(trackPoints[parseInt(trackPoints.length-1)].getCenter())
      }
      loadingBar('hide');
    }
  });
}

function paintTrackPoint(latitude,longitude,hour,last){
  var last = last || null;
  var color = '#F44336';
  var zindex = 1000;
  var radius = 1;
  if(last == 'last'){
    color = '#8BC34A';
    zindex = 10000;
    radius = 2;
  }
  var center = new google.maps.LatLng(latitude,longitude);
  var circle = {
    strokeWeight: 0,
    fillColor: color,
    fillOpacity: 1,
    center: center,
    radius: radius,
    hour: hour,
    zindex: zindex
  };
  trackPoints.push(new google.maps.Circle(circle));
}

function refreshMap(){
  getTrack();
  outputUpdate(0);
  document.querySelector('input#value').value = 0;
  var now = moment().format("DD/MM/YYYY");
  $("#map-date").html(now);
}

function moveDateMap(way){
  var actualHTML = $("#map-date").html();
  var actualDate = moment(actualHTML, "DD/MM/YYYY");
  if(way == 'prev'){
    actualDate.subtract(1,'days');
  }
  else if(way == 'next'){
    actualDate.add(1,'days');
  }
  $("#map-date").html(actualDate.format("DD/MM/YYYY"));
  getTrack(actualDate.format("DD/MM/YYYY"));
  outputUpdate(0);
  document.querySelector('input#value').value = 0;
}

function findImportant(){
  nonImportant = [];
  for(i in trackPoints){
    if(trackPoints[i].getMap() != null){
      var j = 0;
      var adjacent = 0;
      var actual = trackPoints[i].getCenter();
      while(adjacent < 5 && j < trackPoints.length){
        var comparator = trackPoints[j].getCenter();
        if(google.maps.geometry.spherical.computeDistanceBetween(actual,comparator) <= 3){
          adjacent += 1;
        }
        j++;
      }
      if(adjacent < 5){
        nonImportant.push(trackPoints[i]);
      }
    }
  }
  for(i in nonImportant){
    nonImportant[i].setMap(null);
  }
}

function showAll(){
  for(i in nonImportant){
    nonImportant[i].setMap(map);
  }
}

function loadingBar(status){
  if(status == 'show')
    $("#loading").html('<div class="progress progress-striped progress-success active"><div class="bar" style="width: 100%;"></div></div>');
  else
    $("#loading").html('');
}