function getAirport(location,name){
  var airport;
  var data = {
    location: location,
    name: name
  }
  $.ajax({
    url:"/scripts/airportData",
    data: data,
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
  var data = {
    location: location,
    name: name
  }
  $.ajax({
    url:"/scripts/cellsData",
    data: data,
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
  var data = {
    location: location,
    name: name
  }
  $.ajax({
    url:"/scripts/nextCell",
    data: data,
    async: false,
    type:"POST",
    success:function(data) {
      id = data.id_cell;
    }
  });
  return id;
}

function setCell(location,name,cell){
  var data = {
    location: location,
    name: name,
    cell: cell
  }
  $.ajax({
    url:"/scripts/setCell",
    data: data,
    type:"POST"
  });
}

function deleteCell(location,name,cell){
  var data = {
    location: location,
    name: name,
    cell: cell
  }
  $.ajax({
    url:"/scripts/deleteCell",
    data: data,
    type:"POST"
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
  var data = {
    location: location,
    name: name
  }
  $.ajax({
    url:"/scripts/clearGraph",
    data: data,
    type:"POST"
  });
}

function createGraphCell(location, name, cell){
  var data = {
    location: location,
    name: name,
    cell: cell
  }
  $.ajax({
    url:"/scripts/clearGraph",
    data: data,
    type:"POST"
  });
}


function adjacentsCells(location,name,actual){
  var data = {
    location: location,
    name: name,
    id_cell: actual
  };
  var cells;
  $.ajax({
    url:"/scripts/adjacentsCells",
    async: false,
    type:"POST",
    data: data,
    success:function(data) {
      cells = data; 
    }
  });
  return cells;
}