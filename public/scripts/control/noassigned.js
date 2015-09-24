function noAssignedActivities(){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/control/noAssignedActivities",
    type:"POST",
    data: data,
    success:function(data) {
      $("#tabNoAssign > a > .badge").html(data.activities.length);
      var noAssign = $('#tasks_nonasign');
      noAssign.html("");
      for(i in data.activities){
        var activity = data.activities[i];
        var row = "<tr id='activity_" + activity.data.id_activity + "'>";
        row += "<td>";
        row += "<button id='act_manual_" + activity.data.id_activity + "' class='btn btn-primary' title='Manual Assign'><i class='fa fa-user'></i></button> ";
        row += "<button id='act_auto_" + activity.data.id_activity + "' class='btn btn-primary' title='Auto Assign'><i class='fa fa-desktop'></i></button> ";
        row += "<button id='act_discard_" + activity.data.id_activity + "' class='btn btn-primary' title='Discard Rest'><i class='fa fa-minus'></i></button> ";
        row += "<button id='act_delete_" + activity.data.id_activity + "' class='btn btn-primary' title='Delete All'><i class='fa fa-trash'></i></button> ";
        row += "</td>";
        row += "<td>" + activity.data.id_activity  + "</td>";
        row += "<td>" + activity.count + " / <strong>" + activity.data.required + "</strong></td>";
        row += "<td>" + activity.data.category + "</td>";
        row += "<td>" + activity.data.priority + "</td>";
        row += "<td>" + activity.data.description + "</td>";
        row += "</tr>";
        noAssign.append(row); 
      }
    }
  });
}