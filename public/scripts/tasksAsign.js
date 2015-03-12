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
      id_task: "T-" + $('#tasksType').val().toString().substring(0,3).toUpperCase() + "-" + Math.floor(Date.now() / 100),
      id_cell: $('input[name="cell_hide"]').val(),
      type: $('#tasksType').val(),
      priority: $('input[name="taskPriority"]').val(),
      description: $('#description').val(),
      n_employees: $('#nEmployees').val(),
      employees: $('#select-employees').val()
    };

    if($('#tasksAsign').val().toString() == 'manual'){
      manualAsign(task);
    }
    else{

    }

    return false;

  });
});

function manualAsign(task){
  $.ajax({
    url:"/tasks/create",
    type:"POST",
    data: task,
    success: function(data){
      $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: "Tarea: " + task.id_task,
        // (string | mandatory) the text inside the notification
        text: 'Creada correctamente',
        // (string | optional) the image to display on the left
        image: false,
        // (bool | optional) if you want it to fade out on its own or just sit there
        sticky: false,
        // (int | optional) the time you want it to be alive for before fading out
        time: ''
      });
    }
  });
  for(i in task.employees){
    makeWork(location,name,task.id_task,task.employees[i]);
  }
}
function bfs_works(location,name,id_task,origin,n){
  var rest = n;
  var list = [origin];
  var visit = [];
  var selected_employees = [];

  while(list.length > 0 && rest > 0){
    var people = employeesByCell(location,name,list[0],selected_employees);
    if(people.length > 0){
      console.log(people[0]._id)
      rest -= people.length;
      for(var i in people){
        selected_employees.push(parseInt(people[i]._id.id_person));
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
  for(var i in selected_employees){
    makeWork(location,name,id_task,selected_employees[i]);
  }
  return rest;
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
    url:"/work/create",
    type:"POST",
    data: data
  });
}