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
      id_task: "T-" + $('#tasksType').val().toString().substring(0,3).toUpperCase() + "-" + getNextTaskID(LOCATION,NAME) + '-' + Math.floor(Date.now() / 1000),
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
    sendGcmNotification(LOCATION,NAME,task.id_task,task.description,task.employees[i]);
  }
}

function autoAsign(task){
  createTask(task);
  var employees = bfsWorks(LOCATION,NAME,task.id_task,task.id_cell,task.n_employees);
  for(i in employees){
    genericSuccessAlert('Se ha asignado a: '+employees[i].worker_name+' a esta tarea','work');
    sendGcmNotification(LOCATION,NAME,task.id_task,task.description,employees[i].id_person);
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
      var people = employeesByStateAndWork(location,name,tmp,id_task);
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
  var tmp = new Array();
  if(rest < n){
    var i = 0;
    while(i < n-rest){
      tmp.push(selected_employees[i]);
      console.log(selected_employees[i])
      makeWork(location,name,id_task,parseInt(selected_employees[i].id_person));
      i++;
    }
  }
  return tmp;
}
