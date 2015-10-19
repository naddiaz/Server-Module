
function translateLatLng(obj){
  return {
    lat: obj[Object.keys(obj)[0]],
    lng: obj[Object.keys(obj)[1]]
  }
}

function distanceBetweenTwoPoints(pointA,pointB){
  rad = function(x) {
    return x*Math.PI/180;
  }
  
  coordsA = pointA;
  coordsB = pointB;
  
  var R     = 6378.137;
  var dLat  = rad( coordsB.lat() - coordsA.lat() );
  var dLong = rad( coordsB.lng() - coordsA.lng() );

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(coordsA.lat())) * Math.cos(rad(coordsB.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return (d * 1000).toFixed(6);
}