$(document).ready(function(){
  $('#manualAsignGroup').hide();
  
  $("#tasksAsign").change(function(){
    if($(this).val() == "manual"){
      getEmployeesByType(LOCATION,NAME,$('#tasksType').val());
      $('#manualAsignGroup').show();
    }
    else{
      $('#manualAsignGroup').hide();
    }
  });

  $("#tasksType").change(function(){
    $("#tasksAsign").val('automatico');
    $('#manualAsignGroup').hide();
  });

  $('#saveTask').click(function(){


    var task = {
      location: LOCATION,
      name: NAME,
      id_task: "T-" + $('#tasksType').val().toString().substring(0,3).toUpperCase() + "-" + Math.floor(Date.now() / 1000),
      id_cell: $('input[name="cell_hide"]').val(),
      type: $('#tasksType').val(),
      priority: $('input[name="taskPriority"]').val(),
      description: $('#description').val(),
      n_employees: $('#nEmployees').val(),
      employees: $('#select-employees').val()
    };
    $('input').each(function(){
      $(this).val('')
    });
    $('textarea').val('');
    if(checkDataTask(task)){
      if($('#tasksAsign').val().toString() == 'manual'){
        manualAsign(task);
      }
      else{
        autoAsign(task);
      }
    }
    return false;
  });
});


function checkDataTask(task){
  if(task.id_cell == ""){
    genericErrorAlert('Es necesario seleccionar la celda');
    return false;
  }
  if(task.type == "null"){
    genericErrorAlert('No se ha definido la categoría');
    return false;
  }
  if(task.n_employees != (task.n_employees|0)){
    genericErrorAlert('No se puede asignar la tarea a ' + task.n_employees + ', por favor, ponga un número entero (ej: 1,2,3,4,5,...)');
    return false;
  }
  return true;
}

function manualAsign(task){
  createTask(task);
  for(i in task.employees){
    makeWork(LOCATION,NAME,task.id_task,task.employees[i]);
  }
}

function autoAsign(task){
  createTask(task);
  var employees = bfsWorks(LOCATION,NAME,task.id_task,task.id_cell,task.n_employees);
  for(i in employees){
    genericSuccessAlert('Se ha asignado a: '+employees[i].worker_name+' a esta tarea','work');
  }
  if(task.n_employees > employees.length){
    genericWarningAlert('Faltaron ' + (task.n_employees-employees.length) + " empleados por asignar");
  }
}

function createTask(task){
  $.ajax({
    url:"/tasks/create",
    type:"POST",
    data: task,
    success: function(data){
      genericSuccessAlert('Se ha creado la tarea correctamente','tasks');
    }
  });
}

function bfsWorks(location,name,id_task,origin,n){
  var rest = n;
  var list = [origin];
  var visit = [];
  var selected_employees = [];

  while(list.length > 0 && rest > 0){
    var people_cell = employeesByCell(location,name,list[0],selected_employees);
    if(people_cell.length > 0){
      var tmp = new Array();
      for(var i in people_cell){
        tmp.push(parseInt(people_cell[i]._id.id_person));
      }
      var people = employeesByStateAndWork(location,name,tmp);
      if(people.order.length > 0){
        rest -= people.order.length;
        for(var i in people.order){
          selected_employees.push(people.order[i].employee);
        }
      }
    }
    var adjacents = adjacentsCells(location,name,list[0]);
    visit.push(list.shift());
    for(i in adjacents){
      if(visit.indexOf(adjacents[i].cell_end.toString()) == -1 && list.indexOf(adjacents[i].cell_end.toString()) == -1){
        list.push(adjacents[i].cell_end.toString());
      }
    }
  }
  var i = 0;
  var tmp = new Array();
  while(i < n){
    tmp.push(selected_employees[i]);
    makeWork(location,name,id_task,parseInt(selected_employees[i].id_person));
    i++;
  }
  return tmp;
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


function genericErrorAlert(textError){
  $.gritter.add({
    title: 'Error',
    text: '<h4>'+textError+'</h4>',
    image: '/img/error.png',
    sticky: false,
    time: '',
    class_name: 'gritter-alert-error'
  });
}

function genericWarningAlert(textError){
  $.gritter.add({
    title: 'Error',
    text: '<h4>'+textError+'</h4>',
    image: '/img/error.png',
    sticky: false,
    time: '',
    class_name: 'gritter-alert-warning'
  });
}

function genericSuccessAlert(textAlert,icon){
  $.gritter.add({
    title: "Completado",
    text: '<h4>'+textAlert+'</h4>',
    image: '/img/'+icon+'.png',
    sticky: false,
    time: '',
    class_name: 'gritter-alert-success'
    });
}