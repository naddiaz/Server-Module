$(document).ready(function(){
  employeesList();
});

function employeesList(){
  var data = {
    location: LOCATION,
    name: NAME
  }
  $.ajax({
    url:"/employees/list",
    type:"POST",
    data: data,
    success:function(data) {
      var list = $('#employee_list');
      for(i in data.people){
        var html = "<tr id=\""+data.people[i].id_person+"\"><td>"+data.people[i].id_person+"</td><td class=\"cursor-edit\"><spanname>"+data.people[i].worker_name+"</spanname></td><td><spantype class=\"cursor-edit\">"+data.people[i].worker_type+"</spantype></td><td>"+data.people[i].device_type+"</td>";
        var button = "<td><button onclick=\"deleteEmployee('"+data.people[i].id_person+"')\" class=\"btn btn-danger\" title=\"Eliminar empleado\"><i class=\"fa fa-trash\"></button></td>";
        list.append(html+button);
        var id = $('tr#'+data.people[i].id_person+">td");
        editName(id);
        editCategory(id);
      }
      list.prepend(editFields());
    }
  });
}

function editName(id){
  $(id).click(function(){
    if($(this).children().prop('nodeName') == 'SPANNAME'){
      var old_value = $(this).text();
      var id = $(this).parent().attr('id');
      $(this).html("<input type=\"text\" id=\"input_"+id+"\" placeholder=\""+old_value+"\">");
      $("#input_"+id).focus();
      $("#input_"+id).keypress(function(e) {
        if(e.which == 13) {
          if($(this).val() != ''){
            updateEmployeeName($(this).parent().attr('id'),$(this).attr('placeholder'),$(this).val().toUpperCase());
            $(this).parent().html("<spanname>"+$(this).val().toUpperCase()+"</spanname>");
          }
          else
            $(this).parent().html("<spanname>"+old_value+"</spanname>");                  
        }
      });
    }
  });
}

function updateEmployeeName(id,nameOld, nameNew){
  var data ={
    location: LOCATION,
    name: NAME,
    id_person: id,
    worker_name: nameNew
  }
  $.ajax({
    url:"/employees/update/name",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status)
        genericSuccessAlert('Se ha cambiado el nombre de '+nameOld+' por '+nameNew,'fa-user');
      else
        genericErrorAlert('Ha habido un error al cambiar el nombre, por favor, inténtelo de nuevo.');
    }
  });
}

function editCategory(id){
  $(id).click(function(){
    if($(this).children().prop('nodeName') == 'SPANTYPE'){
      listCategories($(this),$(this).children().text());
    }
  });
}

function listCategories(self,actual){
  var data ={
    location: LOCATION,
    name: NAME
  };
  $.ajax({
    url:"/categories/list",
    type:"POST",
    data: data,
    success: function(data){
      var input = "<select>";
      input += "<optgroup label=\"ACTUAL\"><option value=\""+actual+"\">"+actual+"</option></optgroup>";
      input += "<optgroup label=\"DISPONIBLES\">";
      for(i in data.categories){
        input += "<option value=\""+data.categories[i].name.toUpperCase()+"\">"+data.categories[i].name.toUpperCase()+"</option>"
      }
      input += "</optgroup></select>";
      self.html(input);
      self.children().focus();
      self.children().attr('size',data.categories.length+5);
      self.children().change(function(){
        if($(this).val() != actual){
          updateEmployeeType($(this).parent().parent().attr('id'),actual,$(this).val().toUpperCase());
          $(this).parent().html("<spantype>"+$(this).val()+"</spantype>");
        }
        else{
          $(this).parent().html("<spantype>"+actual+"</spantype>");
          genericWarningAlert('No se ha cambiado la categoría del empleado','fa-user');
        }
      });
    }
  });
}

function updateEmployeeType(id,typeOld, typeNew){
  var data ={
    location: LOCATION,
    name: NAME,
    id_person: id,
    worker_type: typeNew
  }
  $.ajax({
    url:"/employees/update/type",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status)
        genericSuccessAlert('Se ha cambiado la categoría de '+typeOld+' por '+typeNew,'fa-user');
      else
        genericErrorAlert('Ha habido un error al cambiar la categoría, por favor, inténtelo de nuevo.');
    }
  });
}

function editFields(){
  var new_id = nextEmployeeID();
  var tr_beign = "<tr>";
  var tr_end = "</td>";
  var td_input_id = "<td><input id=\"ed_"+new_id+"\" type=\"text\" name=\"newEmployeeID\" value=\""+new_id+"\" disabled></td>";
  var td_input_name = "<td><input type=\"text\" name=\"newEmployeeName\" placeholder=\"NOMBRE\"></td>";
  var td_input_type = "<td id=\"selectCategories\"></td>";
  var td_input_device = "<td><input type=\"text\" name=\"newEmployeeDevice\" value=\"ANDROID\" disabled></td>";
  var td_buttons = "<td><button onclick=\"saveEmployee("+new_id+")\" class=\"btn btn-primary\" title=\"Registrar empleado\"><i class=\"fa fa-save\"></button></td>";
  listCategoriesEdit(new_id);
  return (tr_beign+td_input_id+td_input_name+td_input_type+td_input_device+td_buttons+tr_end);
}

function listCategoriesEdit(id){
  var data ={
    location: LOCATION,
    name: NAME
  };
  $.ajax({
    url:"/categories/list",
    type:"POST",
    data: data,
    success: function(data){
      var input = "<select name=\"newEmployeeType\"><optgroup label=\"DISPONIBLES\">";
      for(i in data.categories){
        input += "<option value=\""+data.categories[i].name.toUpperCase()+"\">"+data.categories[i].name.toUpperCase()+"</option>"
      }
      input += "</optgroup></select>";
      $('#selectCategories').html(input);
      $('#ed_'+id).val("E-"+(nextEmployeeID()));
    }
  });
}

function nextEmployeeID(){
  var data ={
    location: LOCATION,
    name: NAME
  };
  var id;
  $.ajax({
    url:"/scripts/nextEmployee",
    type:"POST",
    data: data,
    async: false,
    success: function(data){
      id = parseInt(data.id_person.split('-')[1])+1;
    }
  });
  return id;
}

function saveEmployee(id){
  var data = {
    location: LOCATION,
    name: NAME,
    id_person: $('input[name="newEmployeeID"]').val(),
    worker_name: $('input[name="newEmployeeName"]').val().toUpperCase(),
    worker_type: $('select[name="newEmployeeType"]').val(),
    worker_device: $('input[name="newEmployeeDevice"]').val()
  };
  if(data.worker_name == "")
    genericErrorAlert('No se ha indicado el nombre del empleado');
  else{
    $.ajax({
      url:"/employees/create",
      type:"POST",
      data: data,
      success: function(dat){
        if(dat.status){
          $('#ed_'+id).val("E-"+(nextEmployeeID()));
          $('input[name="newEmployeeName"]').val('');
          var html = "<tr id=\""+data.id_person+"\"><td>"+data.id_person+"</td><td class=\"cursor-edit\"><spanname>"+data.worker_name+"</spanname></td><td><spantype class=\"cursor-edit\">"+data.worker_type+"</spantype></td><td>"+data.worker_device+"</td><td><button onclick=\"deleteEmployee('"+data.id_person+"')\" class=\"btn btn-danger\" title=\"Eliminar empleado\"><i class=\"fa fa-trash\"></button></td>";
          $.when($(html).insertAfter($('#employee_list>tr:first'))).done(function(){
            var id = $('tr#'+data.id_person+">td");
            editName(id);
            editCategory(id);
          });
          genericSuccessAlert('Se ha registrado al empleado','fa-user');
        }
        else{
          genericErrorAlert('Ha habido un error al registrar el nuevo empleado, por favor, inténtelo de nuevo.');
        }
      }
    });
  }
}

function deleteEmployee(id){
  var data = {
    location: LOCATION,
    name: NAME,
    id_person: id
  };
  
  var gritter_id = $.gritter.add({
    title: "Confirmación",
    text: "<h3>¿Desea eliminar al empleado con ID: <b>" + id + "</b>?</h3><button id=\"removeEmployee\" class=\"btn btn-danger\">Eliminar<span id=\""+id+"\"></span></button><button id=\"cancelremoveEmployee\" class=\"btn btn-primary\">Cancelar</button>",
    sticky: true,
    class_name: 'gritter-alert-warning'
  });

  $('#removeEmployee').click(function(){
    $.ajax({
      url:"/employees/delete",
      type:"POST",
      data: data,
      success: function(data){
        if(data.status){
          genericSuccessAlert('Se ha eliminado al empleado','fa-user');
          $('tr#'+id).remove();
          var resest_id = nextEmployeeID();
          $('#employee_list>tr:first>td:first>input').val("E-"+resest_id);
        }
        else
          genericErrorAlert('Ha habido un error al eliminar el empleado, por favor, inténtelo de nuevo.');
      }
    });
    $.gritter.removeAll();
  });
  $('#cancelremoveEmployee').click(function(){
    $.gritter.removeAll();
  });
}