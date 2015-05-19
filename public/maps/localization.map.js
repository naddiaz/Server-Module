// FIXED PARAMS
// LOCATION = #{location} --> in .jade view
// NAME = #{name} --> in .jade view
RADIUS = 30;
LABELOPTIONS = {
    boxStyle: {
        background: '#FFFFFF',
        textAlign: "center",
        fontSize: "10pt",
        width: "15px"
    },
    disableAutoPan: true,
    pixelOffset: new google.maps.Size(-30, 0),
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

var lines_arr = new Array();
var circles_arr = new Array();
function trace_beacons(beacons,map) {
  for(i in lines_arr){
    lines_arr[i].setMap(null);
  }
  lines_arr = [];
  new google.maps.Circle({
    center: new google.maps.LatLng(beacons[0].position.latitude, beacons[0].position.longitude),
    radius: 1,
    fillColor: "#00FF00",
    fillOpacity: 0.7,
    strokeWeight: 0,
    map:map
  });

  new google.maps.Circle({
    center: new google.maps.LatLng(beacons[beacons.length-1].position.latitude, beacons[beacons.length-1].position.longitude),
    radius: 1,
    fillColor: "#0000FF",
    fillOpacity: 0.7,
    strokeWeight: 0,
    map:map
  });

  addArrow(beacons,1,map)
}

function addArrow(beacons,i,map){
  if(i<=beacons.length-1){
    var lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    };
    var lineCoords = new Array();
    lineCoords.push(new google.maps.LatLng(beacons[i-1].position.latitude, beacons[i-1].position.longitude));
    lineCoords.push(new google.maps.LatLng(beacons[i].position.latitude, beacons[i].position.longitude));

    var line = new google.maps.Polyline({
      path: lineCoords,
      icons: [{
        icon: lineSymbol,
        offset: '100%'
      }],
      map: map,
      strokeColor: "#"+randColor(),
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    lines_arr.push(line);
    setTimeout(function(){addArrow(beacons,i+1,map)},750)
  }
}

function randColor(){
  // #CCCCCC to #222222
  return Math.floor(Math.random() * (13421772 - 2236962) + 2236962).toString(16);
}

function hot_beacons_map(beacons,map) {
  for(i in circles_arr)
    circles_arr[i].setMap(null)
  circles_arr = [];
  var base = 0;
  for(i in beacons){
    if(base < beacons[i].frequency)
      base = beacons[i].frequency;
  }
  for(i in beacons){
    var circle = new google.maps.Circle({
      center: new google.maps.LatLng(beacons[i].position.latitude, beacons[i].position.longitude),
      radius: radiusNorm(((beacons[i].frequency/base)*100)*0.3),
      strokeColor: hot_colors(beacons[i].frequency,base),
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: hot_colors(beacons[i].frequency,base),
      fillOpacity: 0.7,
      zIndex: 10
    });
    circles_arr.push(circle);
    circle.setMap(map);
  }
}

function view_hot_zone(show,map){
  for(i in circles_arr){
    if(show){
      circles_arr[i].setMap(map);
    }
    else{
      circles_arr[i].setMap(null);
    }
  }
}

function hot_colors(value,base){
  value = (value * 100) / base;
  if(value > 0 && value <= 20)
    return "#8BC34A";
  if(value > 20 && value <= 40)
    return "#4CAF50";
  if(value > 40 && value <= 60)
    return "#FFEB3B";
  if(value > 60 && value <= 80)
    return "#FF9800";
  if(value > 80 && value <= 100)
    return "#F44336";
}

function radiusNorm(value){
  if(value => 30){
    return 30;
  }
  else if(value => 25){
    return 25;
  }
  else if(value => 20){
    return 20;
  }
  else if(value => 15){
    return 15;
  }
  else if(value => 10){
    return 10;
  }
  else{
    return 8;
  }

}