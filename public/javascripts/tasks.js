function create_task(location,name){
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

  bfs_works(location,name,task.id_task,task.id_cell,task.n_employees);
}

function bfs_works(location,name,id_task,origin,n){
  var rest = n;
  var list = [origin];
  var visit = [];
  var selected_employees = [];

  while(rest > 0){
    var people = get_employees_by_cell(location,name,list[0]);
    console.log(people)
    if(people.length > 0){
      console.log(people[0]._id)
      rest -= people.length;
      for(var i in people){
        selected_employees.push(people[i]._id.id_person.toString());
      }
    }
    var adjacents = get_adjacents_cells(location,name,list[0]);
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
}

function get_employees_by_cell(location,name,actual){
  var data = {
    id_cell: actual
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

function get_adjacents_cells(location,name,actual){
  var data = {
    id_cell: actual
  };
  var cells;
  $.ajax({
    url:"/admin/config/" + location + "/" + name + "/cells/adjacents",
    async: false,
    type:"POST",
    data: data,
    success:function(data) {
      cells = data; 
    }
  });
  return cells;
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