(function(){
  $('#manualAssignBox').hide();
  $('#assignMethod').change(function(){
    $('#manualAssignSelect').html("");
    if( $(this).val() == "automatic" ){
      $('#manualAssignBox').hide();
    }
    else if( $(this).val() == "manual" ){
      $('#manualAssignBox').show();
      employeesListByCategory($('#categories').val());
    }
  });
  $('#categories').change(function(){
    $('#manualAssignBox').hide();
    $('#manualAssignSelect').html("");
    $('#assignMethod').val("automatic");
  });
  $('#required').change(function(){
    checkMaximum();
  });
  $('#activitySave').click(function(){
    console.log("SAVE");
    checkFields();
  });
})();

function employeesListByCategory(category){
  var data = {
    id_installation: ID_INSTALLATION,
    category: category
  }
  $.ajax({
    url:"/helper/employees/employeesListByCategory",
    type:"POST",
    data: data,
    success:function(data) {
      var manualAssignSelect = $('#manualAssignSelect');
      if(data.employees.length == 0){
        var dv = "<div class='row-fluid'>";
        dv += "<p>In this category not found any employee</p>";
        dv += "</div>";
        manualAssignSelect.append(dv);
      }
      for(var i=0; i<data.employees.length; i+=2){
        var dv = "<div class='row-fluid'>";
        dv += "<div class='span6'><li><input class='employeeList' type='checkbox' value='" + data.employees[i].id_employee + "'> ";
        dv += data.employees[i].name + " ( " + data.employees[i].id_employee +" )</li></div>";
        if(i+1 < data.employees.length){
          dv += "<div class='span6'><li><input class='employeeList' type='checkbox' value='" + data.employees[i+1].id_employee + "'> ";
          dv += data.employees[i+1].name + " ( " + data.employees[i+1].id_employee +" )</li></div>";
        }
        dv += "</div>";
        manualAssignSelect.append(dv);
      }
      $('.employeeList').change(function(){
        checkMaximum();
      });
    }
  });
}

function checkMaximum(){
  var maxRequired = 0;
  $('.employeeList').each(function(){
    if($(this).is(':checked')){
      maxRequired += 1;
    }
  });
  if(maxRequired == $('#required').val()){
    $(this).attr("checked", false);
    $('.employeeList').each(function(){
      if($(this).is(':checked') == false){
        $(this).parent().addClass('maximumSelected');
        $(this).attr("disabled", true);
      }
    });
  }
  else if(maxRequired > $('#required').val()){
    $('.employeeList').attr("checked", false);
    $('.employeeList').parent().removeClass('maximumSelected');
    $('.employeeList').attr("disabled", false);
  }
  else{
    $('.employeeList').parent().removeClass('maximumSelected');
    $('.employeeList').attr("disabled", false);
  }
}

function checkFields(){
  var error = false;
  var list = [];
  if($('#assignMethod').val() == 'manual'){
    var maxRequired = 0;
    $('.employeeList').each(function(){
      if($(this).is(':checked')){
        maxRequired += 1;
        list.push($(this).val());
      }
    });
    if(maxRequired < $('#required').val()){
      alertError(0);
      error = true;
    }
  }
  if($('#details').val() == ""){
    alertError(1);
    error = true;
  }
  if($('#location').val() == ""){
    alertError(2);
    error = true;
  }
  if($('#weightHours').val() == "0" && $('#weightMinutes').val() == "0"){
    alertError(3);
    error = true;
  }
  if(!error){
    createActivity(list);
  }
}

function createActivity(list){
  var loc = JSON.parse($('#location').val());
  var data = {
    id_installation: ID_INSTALLATION,
    location: {
      latitude: loc.lat,
      longitude: loc.lng
    },
    category: $("#categories").val(),
    priority: $("#priority").val(),
    required: $("#required").val(),
    hour: $("#weightHours").val(),
    minutes: $("#weightMinutes").val(),
    description: $("#details").val(),
    employees: list
  }
  $.ajax({
    url:"/activity/create",
    type:"POST",
    data: data,
    success:function(data) {
      console.log(data)
      var text = "<p>" + data.activity.category + "</p>";
      text += "<p>" + data.activity.id_activity + "</p>";
      alertSuccess(0,text);
      for(var i=0; i<data.task.length; i++){
        var text = "<p>" + data.task[i].id_employee + "</p>";
        text += "<p>" + data.task[i].id_task + "</p>";
        alertSuccess(1,text);
      }
    }
  });
}

function alertError(code){
  var lang = getLang();
  var text = "";
  if(lang == "en")
    text = errors.en[code]
  if(lang == "es")
    text = errors.es[code]
  $.gritter.add({
    title: 'Error',
    text: '<h4>'+text+'</h4>',
    sticky: false,
    time: 8000,
    class_name: 'gritter-alert-error'
  });
}

function alertSuccess(code,extra){
  var lang = getLang();
  var text = "";
  if(lang == "en")
    text = success.en[code]
  if(lang == "es")
    text = success.es[code]
  $.gritter.add({
    text: '<h4>'+text+'</h4><div>'+extra+'</div>',
    sticky: false,
    time: 8000,
    class_name: 'gritter-alert-success'
  });
}

function getLang(){
  return navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
}

var errors = {
  "en": [
    "The number of selected employees is incorrect",
    "Activity description is required",
    "The location of activity is needed",
    "Estimated time is required"
  ],
  "es" : [
    "El número de empleados seleccionados no es correcto",
    "La descripción de la actividad es obligatoria",
    "Se necesita la ubicación de la actividad",
    "Se necesita especificar el tiempo estimado"
  ]
}

var success = {
  "en": [
    "The activity was created successfully",
    "The task was assigned successfully"
  ],
  "es" : [
    "La actividad se ha creado correctamente",
    "La tarea se ha asignado correctamente"
  ]
}
