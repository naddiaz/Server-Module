$(document).ready(function(){
  tasksStates();
  worksStates();
  employeesStates();
  setInterval(function(){ refreshPanels(); }, 10000);
});

function refreshPanels(){
  worksStates();
  employeesStates();
  tasksStates();
}

/*
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
*/
function tasksStatesController(data){
  console.log(data)
  if(data.tasks_active.length != $('#tasks_active').html()){
    $('#tasks_active').html(data.tasks_active.length);
  }
  if(data.tasks_pending.length != $('#tasks_pending').html()){
    $('#tasks_pending').html(data.tasks_pending.length || 0);
  }
  if(data.tasks_complete.length != $('#tasks_complete').html()){
    $('#tasks_complete').html(data.tasks_complete.length || 0);
  }
  tasksNoAsign(data);

}

function tasksNoAsign(data){
  var tasks_nonasign = $('#tasks_nonasign');
    for(i in data.tasks_nonasign){
      var task = data.tasks_nonasign[i];
      var html = "<tr id=\"tr_"+task.task.id_task+"_pending\"><td>"+task.task.id_task+"</td><td class=\"task_pending\">"+task.pending+" de "+task.task.n_employees+"</td><td>"+task.task.type.toUpperCase()+"</td><td>"+task.task.priority+"</td><td>"+task.task.description.toUpperCase()+"</td>";
      var refresh_button = "<td><button id=refresh_"+task.task.id_task+" class\"btn\" title=\"Reintentar la asignación\"><i class=\"fa fa-refresh\"></button></td></tr>";
      var newTr = $(html+refresh_button);

      var actual_task = $('#tr_'+task.task.id_task+"_pending");
      if(actual_task.length > 0){
        if(actual_task.find('.task_pending').html() != (task.pending+" de "+task.task.n_employees)){
          actual_worker.find('.worker_state').html(task.pending+" de "+task.task.n_employees)
        }
      }
      else{
        tasks_nonasign.append(newTr);
        reasign(task.task.id_task,task.pending,task.task.id_cell);
      }
    }
}

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
      tasksStatesController(data);
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
      if(works_stop.length < data.works_stop.length)
        works_stop.html("");
      for(i in data.works_stop){
        var work = data.works_stop[i];
        if(work.state.toUpperCase() == "CANCEL") state = "CANCELADO";
        if(work.state.toUpperCase() == "PAUSE") state = "PAUSADO";
        var html = "<tr id=\"tr_"+work.task.id_task+"_"+work.person.id_person+"_pause_cancel\"><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>" + state + "</td><td>"+work.task.description.toUpperCase()+"</td>";
        var newTr = $(html);
        checkChanges(works_stop,newTr,"tr_"+work.task.id_task+"_"+work.person.id_person+"_pause_cancel");
      }
      cleanAfter(works_stop,data.works_stop,"pause_cancel");

      var works_pending = $('#works_pending');
      if(works_pending.length < data.works_pending.length)
        works_pending.html("");
      for(i in data.works_pending){
        var work = data.works_pending[i];
        var html = "<tr id=\"tr_"+work.task.id_task+"_"+work.person.id_person+"_pending\"><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.task.description.toUpperCase()+"</td>";
        var newTr = $(html);
        checkChanges(works_pending,newTr,"tr_"+work.task.id_task+"_"+work.person.id_person+"_pending");
      }
      cleanAfter(works_pending,data.works_pending,"pending");

      var works_active = $('#works_active');
      if(works_active.length < data.works_active.length)
        works_active.html("");
      for(i in data.works_active){
        var work = data.works_active[i];
        var html = "<tr id=\"tr_"+work.task.id_task+"_"+work.person.id_person+"_active\"><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.task.description.toUpperCase()+"</td>";
        var newTr = $(html);
        checkChanges(works_active,newTr,"tr_"+work.task.id_task+"_"+work.person.id_person+"_active");
      }
      cleanAfter(works_active,data.works_active,"active");

      var works_complete = $('#works_complete');
      if(works_complete.length < data.works_complete.length)
        works_complete.html("");
      for(i in data.works_complete){
        var work = data.works_complete[i];
        var html = "<tr id=\"tr_"+work.task.id_task+"_"+work.person.id_person+"_complete\"><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type.toUpperCase()+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.task.description.toUpperCase()+"</td>";
        var newTr = $(html);
        checkChanges(works_complete,newTr,"tr_"+work.task.id_task+"_"+work.person.id_person+"_complete");
      }
      cleanAfter(works_complete,data.works_complete,"complete");
    }
  });
}

function checkChanges(work_table,newTr,id){
  var actual_task = $("#"+id);
  //console.log(id)
  if(actual_task.length == 0){
    work_table.append(newTr);
  }
  else{
    actual_task.html(newTr.find("tr").html());
  }
}

function cleanAfter(work,data,id){
  if(data.length == 0)
    $(work.find("tr")).remove()
  else{
    for(var j=0; j<work.find("tr").length; j++){
      var cont = 0;
      for(i in data){
        console.log("tr_"+data[i].id_task+"_"+data[i].id_person+"_"+id);
        if($(work.find("tr")[i]).attr('id') == "tr_"+data[i].id_task+"_"+data[i].id_person+"_"+id){
          cont++;
        }
      }
      if(cont == 0)
        $(work.find("tr")[j]).remove()
      cont = 0;
    }
  }
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
        var html = "<tr id=\"tr_"+people.data.id_person+"\"><td><button title=\"Ver historial de: "+people.data.worker_name+"\" id=\"history_"+people.data.id_person+"\" class=\"btn btn-primary\"><i class=\"fa fa-history\"></button></td><td>"+people.data.id_person+"</td><td>"+people.data.worker_name+"</td><td>"+people.data.worker_type+"</td><td class=\"worker_state " + people.state + "\">"+people.state+"</td>";

          var actual_worker = $('#tr_'+people.data.id_person);
          if(actual_worker.length > 0){
            if(actual_worker.find('.worker_state').html() != people.state){
              actual_worker.find('.worker_state').html(people.state)
              if(actual_worker.find('.worker_state').hasClass("ACTIVO"))
                actual_worker.find('.worker_state').removeClass("ACTIVO").addClass('worker_state '+people.state);
              if(actual_worker.find('.worker_state').hasClass("DESOCUPADO"))
                actual_worker.find('.worker_state').removeClass("DESOCUPADO").addClass('worker_state '+people.state);
              if(actual_worker.find('.worker_state').hasClass("ESPERA"))
                actual_worker.find('.worker_state').removeClass("ESPERA").addClass('worker_state '+people.state);
            }
          }
          else{
            employees_state.append(html);
            historyAction(people.data.id_person);
          }
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