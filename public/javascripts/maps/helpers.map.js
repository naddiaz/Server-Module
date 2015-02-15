function getAirport(location,name){
  var airport;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/airport/info",
    async: false,
    type:"POST",
    success:function(data) {
      airport = data; 
    }
  });
  return airport;
}

function getCells(location,name){
  var cells;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cells/info",
    async: false,
    type:"POST",
    success:function(data) {
      cells = data; 
    }
  });
  return cells;
}

function getNextCellID(location,name){
  var id;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cell/next",
    async: false,
    type:"POST",
    success:function(data) {
      id = data.id_cell;
    }
  });
  return id;
}

function setCell(location,name,cell){
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cell/create",
    type:"POST",
    data: cell
  });
}

function deleteCell(location,name,cell){
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cell/delete",
    type:"POST",
    data: cell
  });
}

// Grafo de adyacencia
function makeGraph(location,name,radius){
  var cells = getCells(location,name);
  if(cells.length >= 2){
    clearGraph(location,name);
    for(var i=0; i<cells.length; i++){
      for(var j=0; j<cells.length; j++){
        if(cells[i] != cells[j]){
          var origin = new google.maps.LatLng(cells[i].latitude,cells[i].longitude);
          var end = new google.maps.LatLng(cells[j].latitude,cells[j].longitude);
          var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, end);
          if(distance <= (radius*2)){
            var cell = {
              cell_origin: cells[i].id_cell,
              cell_end: cells[j].id_cell,
              distance: distance
            }
            createGraphCell(location,name,cell);
          }
        }
      }
    }
  }
}

function clearGraph(location, name){
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/graph/clear",
    type:"POST"
  });
}

function createGraphCell(location, name, data){
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/graph/create",
    type:"POST",
    data: data
  });
}