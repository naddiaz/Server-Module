$(document).ready(function(){
  tasksStates();
  worksStates();
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
        var html = "<tr><td>"+task.task.id_task+"</td><td>"+task.pending+" / <strong>"+task.task.n_employees+"</strong></td><td>"+task.task.type+"</td><td>"+task.task.priority+"</td><td>"+task.task.description+"</td>";
        var refresh_button = "<td><button id=refresh_\""+task.task.id_task+"\" class\"btn\" title=\"Reintentar la asignación\"><i class=\"fa fa-refresh\"></button></td></tr>";
        tasks_nonasign.append(html+refresh_button);
      }
    }
  });
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
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.state+"</td><td>"+work.task.description+"</td>";
        works_stop.append(html);
      }
      var works_pending = $('#works_pending');
      for(i in data.works_pending){
        var work = data.works_pending[i];
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.state+"</td><td>"+work.task.description+"</td>";
        works_pending.append(html);
      }
      var works_active = $('#works_active');
      for(i in data.works_active){
        var work = data.works_active[i];
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.state+"</td><td>"+work.task.description+"</td>";
        works_active.append(html);
      }
      var works_complete = $('#works_complete');
      for(i in data.works_complete){
        var work = data.works_complete[i];
        var html = "<tr><td>"+work.task.id_task+"</td><td>"+work.person.worker_name+"</td><td>"+work.task.type+"</td><td>"+work.task.priority+"</td><td>"+getDateFormatter(work.asign_at)+"</td><td>"+work.state+"</td><td>"+work.task.description+"</td>";
        works_complete.append(html);
      }
    }
  });
}

function getDateFormatter(str_date){
  var date = new Date(str_date);
  return "<strong>" + date.getHours() + ":" + date.getMinutes() + "</strong> " + date.getDay() + "/" + date.getMonth() + "/" + date.getYear();
}