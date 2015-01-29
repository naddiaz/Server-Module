function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(28, -16),
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);
}