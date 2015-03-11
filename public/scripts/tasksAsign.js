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
});
