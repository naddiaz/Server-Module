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

function initialize(beacons) {
  var airport = getAirport(LOCATION,NAME);
  var mapOptions = {
    center: new google.maps.LatLng(airport.latitude,airport.longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: STYLE
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);

  var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  };

  new google.maps.Circle({
    center: new google.maps.LatLng(beacons[0].position.latitude, beacons[0].position.longitude),
    radius: 2,
    strokeColor: "#00FF00",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#00FF00",
    fillOpacity: 0.7,
    map:map
  });

  new google.maps.Circle({
    center: new google.maps.LatLng(beacons[beacons.length-1].position.latitude, beacons[beacons.length-1].position.longitude),
    radius: 2,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0000FF",
    fillOpacity: 0.7,
    map:map
  });

  for(var i= 1; i<beacons.length; i++){
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
  }  
}

function randColor(){
  // #CCCCCC to #222222
  return Math.floor(Math.random() * (13421772 - 2236962) + 2236962).toString(16);
}