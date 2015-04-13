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

function getNextTaskID(location,name){
  var id;
  var data = {
    location: location,
    name: name
  }
  $.ajax({
    url:"/scripts/nextTask",
    data: data,
    async: false,
    type:"POST",
    success:function(data) {
      id = data.id_task;
    }
  });
  return id;
}

function getNextEmployeeID(location,name){
  var id;
  var data = {
    location: location,
    name: name
  }
  $.ajax({
    url:"/scripts/nextEmployee",
    data: data,
    async: false,
    type:"POST",
    success:function(data) {
      id = data.id_person;
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

function setBeacon(location,name,beacon){
  var data = {
    location: location,
    name: name,
    beacon: beacon
  }
  $.ajax({
    url:"/scripts/setBeacon",
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

function deleteBeacon(location,name,beacon){
  var data = {
    location: location,
    name: name,
    beacon: beacon
  }
  $.ajax({
    url:"/scripts/deleteBeacon",
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
            createGraph(location,name,cell);
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

function createGraph(location, name, cell){
  var data = {
    location: location,
    name: name,
    cell: cell
  }
  $.ajax({
    url:"/scripts/createGraph",
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

function employeesByCell(location,name,actual,selected_employees){
  var last_minute = new Date();
  last_minute.setMinutes(last_minute.getMinutes()-1);
  var data = {
    location: location,
    name: name,
    id_cell: actual,
    ids_people: JSON.stringify(selected_employees),
    last_minute: last_minute
  };
  var people;
  $.ajax({
    url:"/scripts/employeesByCell",
    async: false,
    type:"POST",
    data: data,
    success:function(data) {
      people = data; 
    }
  });
  return people;
}

function employeesData(location,name,id){
  var data = {
    location: location,
    name: name,
    id_person: id
  };
  var person;
  $.ajax({
    url:"/scripts/employeesData",
    async: false,
    type:"POST",
    data: data,
    success:function(data) {
      person = data; 
    }
  });
  return person;
}


function employeesByStateAndWork(location,name,employees,id_task){
  var data = {
    location: location,
    name: name,
    people: employees,
    id_task: id_task
  }
  var people;
  $.ajax({
    url:"/scripts/employeesByStateAndWork",
    type:"POST",
    data: data,
    async: false,
    success:function(data){
      people = data; 
    }
  });
  return people;
}

function makeWork(location,name,id_task,id_person){
  var data = {
    location: location,
    name: name,
    id_task: id_task,
    id_person: id_person
  }
  $.ajax({
    url:"/works/create",
    type:"POST",
    data: data,
    success:function(data){
    }
  });
}

function sendGcmNotification(location,name,id_task,description,id_person){
  var data = {
    location: location,
    name: name,
    id_task: id_task,
    id_person: id_person,
    description: description
  }
  $.ajax({
    url:"/gcm/create",
    type:"POST",
    data: data,
    success:function(data){
    }
  });
}