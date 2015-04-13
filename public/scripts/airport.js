$(document).ready(function(){
  tasksStates();
  worksStates();
  employeesStates();
});

function tasksStates(){
  var data = {
    location: LOCATION,
    name: NAME
  }
  $.ajax({
    url:"/airport/tasksStates",
    type:"POST",
    data: data,
    success:function(data) {
      $('#tasks_active').html(data.tasks_active.length);
      $('#tasks_pending').html(data.tasks_pending.length);
      $('#tasks_complete').html(data.tasks_complete.length);
      var tasks_nonasign = $('#tasks_nonasign');
      for(i in data.tasks_nonasign){
        var task = data.tasks_nonasign[i];
        var html = "<tr><td>"+task.task.id_task+"</td><td>"+task.pending+" / <strong>"+task.task.n_employees+"</strong></td><td>"+task.task.type.toUpperCase()+"</td><td>"+task.task.priority+"</td><td>"+task.task.description.toUpperCase()+"</td>";
        var refresh_button = "<td><button id=refresh_"+task.task.id_task+" class\"btn\" title=\"Reintentar la asignación\"><i class=\"fa fa-refresh\"></button></td></tr>";
        tasks_nonasign.append(html+refresh_button);
        reasign(task.task.id_task,task.pending,task.task.id_cell);
      }
    }
  });
}

function clearTasks(){
  $('#tasks_active').html('');
  $('#tasks_pending').html('');
  $('#tasks_complete').html('');
  $('#tasks_nonasign').html('');
}

function clearWorks(){
  $('#works_active').html('');
  $('#works_complete').html('');
  $('#works_pending').html('');
  $('#works_stop').html('');
}

function clearEmployees(){
  $('#employees_state').html('');
}

function worksStates(){
  var data = {
    location: LOCATION,
    name: NAME
  }
  $.ajax({
    url:"/airport/worksStates",
    type:"POST",
    data: data,
    success:function(data) {
      var works_stop = $('#works_stop');
      for(i in data.works_stop){
        var work = data.works_stop[i];
        if(work.state.toUpperCase() == "CANCEL") state = "CANCELADO";
        if(work.state.toUpperCase() == "PAUSE") state = "PAUSADO";
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>" + state + "</td><td>"+work.task.description.toUpperCase()+"</td>";
        works_stop.append(html);
      }
      var works_pending = $('#works_pending');
      for(i in data.works_pending){
        var work = data.works_pending[i];
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.task.description.toUpperCase()+"</td>";
        works_pending.append(html);
      }
      var works_active = $('#works_active');
      for(i in data.works_active){
        var work = data.works_active[i];
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.task.description.toUpperCase()+"</td>";
        works_active.append(html);
      }
      var works_complete = $('#works_complete');
      for(i in data.works_complete){
        var work = data.works_complete[i];
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.task.description.toUpperCase()+"</td>";
        works_complete.append(html);
      }
    }
  });
}

function getDateFormatter(str_date){
  var date = new Date(str_date);
  return "<strong>" + date.toLocaleTimeString() + "</strong> -- <span>" + date.toLocaleDateString() +"</span>";
}

function employeesStates(){
  var data = {
    location: LOCATION,
    name: NAME
  }
  $.ajax({
    url:"/airport/employeesStates",
    type:"POST",
    data: data,
    success:function(data) {
      var employees_state = $('#employees_state');
      for(i in data.people){
        var people = data.people[i];
        var html = "<tr><td><button title=\"Ver historial de: "+people.data.worker_name+"\" id=\"history_"+people.data.id_person+"\" class=\"btn btn-primary\"><i class=\"fa fa-history\"></button></td><td>"+people.data.id_person+"</td><td>"+people.data.worker_name+"</td><td>"+people.data.worker_type+"</td><td class=\"" + people.state + "\">"+people.state+"</td>";
        employees_state.append(html);
        historyAction(people.data.id_person);
      }
    }
  });
}

function reasign(id,pending,cell){
  $('#refresh_'+id).click(function(){
    var employees = bfsWorks(LOCATION,NAME,id,cell,pending);
    for(i in employees){
      genericSuccessAlert('Se ha asignado a: '+employees[i].worker_name+' a esta tarea','work');
    }
    if(pending > employees.length){
      genericWarningAlert('Faltaron ' + (pending-employees.length) + " empleados por asignar");
    }
    clearTasks();
    clearWorks();
    clearEmployees();
    tasksStates();
    worksStates();
    employeesStates();
  });
}

function historyAction(id){
  $("#history_"+id).click(function(){
    window.location.pathname = "/airport/"+LOCATION+"/"+NAME+"/history/"+id;
  });
}