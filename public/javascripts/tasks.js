function create_task(location,name){
  var task = {
      id_task: $('input[name="id_task"]').val(),
      id_cell: $('input[name="id_cell_hide"]').val(),
      type: $('#task_type').val(),
      priority: $('input[name="task_priority"]').val(),
      description: $('#description').val(),
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
}