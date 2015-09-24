function completedTasks(){
  var data = {
    id_installation: ID_INSTALLATION,
    state: 4
  }
  $.ajax({
    url:"/helper/control/tasksStates",
    type:"POST",
    data: data,
    success:function(data) {
      $("#tabCompleted > a > .badge").html(data.tasks.length);
      var works = $('#works_completed');
      works.html("");
      for(i in data.tasks){
        var task = data.tasks[i];
        var row = "<tr id='completed_" + task.id_task + "'>";
        row += "<td>";
        row += "<button class='completed_history_" + task.id_employee + " btn btn-primary' title='Employee history'><i class='fa fa-history'></i></button> ";
        row += "<button id='completed_activity_" + task.id_task + "' class='btn btn-primary' title='Activity details' data-effect='mfp-zoom-in' href='#details-popup'><i class='fa fa-tasks'></i></button>";
        row += "</td>";
        row += "<td>" + task.id_task + "</td>";
        row += "<td>" + task.id_employee + "</td>";
        row += "<td>" + moment(new Date(task.created_at)).format('HH:mm') + "</td>";
        row += "<td>" + formatTime(task.time) + "</td>";
        row += "</tr>";
        works.append(row);
        historyEvent(".completed_history_" + task.id_employee,task.id_employee);
        detailsEvent("#completed_activity_" + task.id_task);
      }
    }
  });
}