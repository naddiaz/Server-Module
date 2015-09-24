function employeesStates(){
  var data = {
    id_installation: ID_INSTALLATION
  }
  var ajax = $.ajax({
    url:"/helper/control/employeesStates",
    type:"POST",
    data: data,
    success:function(data) {
      $("#tabEmployees > a > .badge").html(data.employees.length);
      var employees_state = $('#employees_state');
      employees_state.html("");
      for(i in data.employees){
        var employee = data.employees[i];
        var row = "<tr id='" + employee.data.id_employee + "'>";
        row += "<td><button id='history_" + employee.data.id_employee + "' class='btn btn-primary'><i class='fa fa-history'></button></td>";
        row += "<td>" + employee.data.id_employee + "</td>";
        row += "<td>" + employee.data.name + "</td>";
        row += "<td>" + employee.data.category + "</td>";
        var count = {
          assigned: 0,
          active: 0,
          paused: 0,
          completed: 0,
          canceled: 0,
          time: 0
        };
        for(var j in employee.tasks){
          if(employee.tasks[j].state == 1){
            count.assigned += 1;
          }
          if(employee.tasks[j].state == 2){
            count.active += 1;
          }
          if(employee.tasks[j].state == 3){
            count.paused += 1;
          }
          if(employee.tasks[j].state == 4){
            count.completed += 1;
          }
          if(employee.tasks[j].state == 5){
            count.canceled += 1;
          }
          count.time += employee.tasks[j].time;
        }
        row += "<td id='tasks_" + employee.data.id_employee + "' class='fixed-cell'>" + count.assigned + "</td>";
        row += "<td id='tasks_" + employee.data.id_employee + "' class='fixed-cell'>" + count.active + "</td>";
        row += "<td id='tasks_" + employee.data.id_employee + "' class='fixed-cell'>" + count.paused + "</td>";
        row += "<td id='tasks_" + employee.data.id_employee + "' class='fixed-cell'>" + count.completed + "</td>";
        row += "<td id='tasks_" + employee.data.id_employee + "' class='fixed-cell'>" + count.canceled + "</td>";
        row += "<td id='tasks_" + employee.data.id_employee + "' class='fixed-cell'>" + formatTime(count.time) + "</td>";
        row += "</tr>";
        employees_state.append(row);
        historyEvent("#history_" + employee.data.id_employee,employee.data.id_employee);
      }
    }
  });
return ajax;
}