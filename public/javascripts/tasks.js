function create_task(location,name){
  if($('#sr-manual').is(':checked')){
    create_task_manual(location,name);
  }
  else{
    create_task_auto(location,name);
  }
}

function create_task_manual(location,name){
  var task = {
      id_task: $('input[name="id_task"]').val(),
      id_cell: $('input[name="id_cell_hide"]').val(),
      type: $('#task_type').val(),
      priority: $('input[name="task_priority"]').val(),
      description: $('#description').val(),
      n_employees: $('#n_employees').val(),
      employees: $('#select-employees').val()
  };
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/task/create",
    type:"POST",
    data: task,
    success: function(data){
      var row = "<td>" + data.id_task + "</td>";
      row += "<td>" + data.id_cell + "</td>";
      row += "<td>" + data.type + "</td>";
      row += "<td>" + data.priority + "</td>";
      row += "<td>" + data.description + "</td>";
      $("#active_tasks").prepend("<tr>" + row + "</tr>");
    }
  });
  $('input').each(function(){
    $(this).val('')
  });
  $('textarea').val('');
  for(i in task.employees){
    make_work(location,name,task.id_task,task.employees[i]);
  }
  manualAsing();
}

function manualAsing() {
  $( "#dialog-pending > p" ).html("Se ha asignado la tarea a los empleados que ha seleccionado");
  $( "#dialog-pending" ).attr("title","Empleados asignados correctamente");
  $( "#dialog-pending" ).dialog({
    resizable: false,
    width: 350,
    height:250,
    modal: true,
    buttons: {
      OK: function() {
        $( this ).dialog( "close" );
      }
    }
  });
}

function create_task_auto(location,name){
  var task = {
      id_task: $('input[name="id_task"]').val(),
      id_cell: $('input[name="id_cell_hide"]').val(),
      type: $('#task_type').val(),
      priority: $('input[name="task_priority"]').val(),
      description: $('#description').val(),
      n_employees: $('#n_employees').val()
  };
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/task/create",
    type:"POST",
    data: task,
    success: function(data){
      var row = "<td>" + data.id_task + "</td>";
      row += "<td>" + data.id_cell + "</td>";
      row += "<td>" + data.type + "</td>";
      row += "<td>" + data.priority + "</td>";
      row += "<td>" + data.description + "</td>";
      $("#active_tasks").prepend("<tr>" + row + "</tr>");
    }
  });
  $('input').each(function(){
    $(this).val('')
  });
  $('textarea').val('');

  var pending = bfs_works(location,name,task.id_task,task.id_cell,task.n_employees);
  isPending(task.n_employees,pending);
}

function isPending(n,rest) {
  if(rest != 0){
    $( "#dialog-pending > p" ).html("Al realizar la búsqueda hemos detectado que solamente están activos <strong>" + (n-rest) + " de " + n + "</strong> empleados.");
    $( "#dialog-pending" ).attr("title","Empleados sin asignación");
  }
  else{
    $( "#dialog-pending > p" ).html("Se han encontrado <strong>" + (n-rest) + " de " + n + "</strong> empleados para realizar la tarea solicitada.");
    $( "#dialog-pending" ).attr("title","Empleados asignados correctamente");
  }
  $( "#dialog-pending" ).dialog({
    resizable: false,
    width: 350,
    height:250,
    modal: true,
    buttons: {
      OK: function() {
        $( this ).dialog( "close" );
      }
    }
  });
}

function bfs_works(location,name,id_task,origin,n){
  var rest = n;
  var list = [origin];
  var visit = [];
  var selected_employees = [];

  while(list.length > 0 && rest > 0){
    var people = get_employees_by_cell(location,name,list[0],selected_employees);
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
    make_work(location,name,id_task,selected_employees[i]);
  }
  return rest;
}

function get_employees_by_cell(location,name,actual,selected_employees){
  var last_minute = new Date();
  last_minute.setMinutes(last_minute.getMinutes()-1);
  var data = {
    id_cell: actual,
    ids_people: JSON.stringify(selected_employees),
    last_minute: last_minute
  };
  var people;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/localization/employeesByCell",
    async: false,
    type:"POST",
    data: data,
    success:function(data) {
      people = data; 
    }
  });
  return people;
}

function make_work(location,name,id_task,id_person){
  var data = {
    id_task: id_task,
    id_person: id_person
  }
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/work/create",
    type:"POST",
    data: data
  });
}