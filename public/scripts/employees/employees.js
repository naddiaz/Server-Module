$(document).ready(function(){
  employeesList();
});

function employeesList(){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/employees/employeesList",
    type:"POST",
    data: data,
    success:function(data) {
      var list = $('#employee_list');
      for(i in data.people){
        var html = "<tr id=\""+data.people[i].id_employee+"\"><td><button title=\"History: "+data.people[i].name+"\" id=\"history_"+data.people[i].id_employee+"\" class=\"btn btn-primary\"><i class=\"fa fa-history\"></button></td><td>"+data.people[i].id_employee+"</td><td class=\"cursor-edit\"><spanname>"+data.people[i].name+"</spanname></td><td class=\"cursor-edit\"><spanlastname>"+data.people[i].last_name+"</spanlastname></td><td><spantype class=\"cursor-edit\">"+data.people[i].category+"</spantype></td><td>"+data.people[i].device+"</td>";
        var button = "<td><button onclick=\"deleteEmployee('"+data.people[i].id_employee+"')\" class=\"btn btn-danger\" title=\"Delete\"><i class=\"fa fa-trash\"></button></td>";
        list.append(html+button);
        var id = $('tr#'+data.people[i].id_employee+">td");
        editName(id);
        editCategory(id);
        editLastName(id);
        historyEvent(data.people[i].id_employee);
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
    id_installation: ID_INSTALLATION,
    id_employee: id,
    name: nameNew
  }
  $.ajax({
    url:"/helper/employees/updateName",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status)
        genericSuccessAlert('Change employee name: '+nameOld+' for '+nameNew,'fa-user');
      else
        genericErrorAlert('Error when try to change a employee name');
    }
  });
}

function editLastName(id){
  $(id).click(function(){
    if($(this).children().prop('nodeName') == 'SPANLASTNAME'){
      var old_value = $(this).text();
      var id = $(this).parent().attr('id');
      $(this).html("<input type=\"text\" id=\"input_"+id+"\" placeholder=\""+old_value+"\">");
      $("#input_"+id).focus();
      $("#input_"+id).keypress(function(e) {
        if(e.which == 13) {
          if($(this).val() != ''){
            updateEmployeeLastName(id,$(this).attr('placeholder'),$(this).val().toUpperCase());
            $(this).parent().html("<spanlastname>"+$(this).val().toUpperCase()+"</spanlastname>");
          }
          else
            $(this).parent().html("<spanlastname>"+old_value+"</spanlastname>");                  
        }
      });
    }
  });
}

function updateEmployeeLastName(id,nameOld, nameNew){
  var data ={
    id_installation: ID_INSTALLATION,
    id_employee: id,
    last_name: nameNew
  }
  console.log(data)
  $.ajax({
    url:"/helper/employees/updateLastName",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status)
        genericSuccessAlert('Change employee Last name: '+nameOld+' for '+nameNew,'fa-user');
      else
        genericErrorAlert('Error when try to change a employee last name');
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
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/employees/categoriesList",
    type:"POST",
    data: data,
    success: function(data){
      var input = "<select>";
      input += "<optgroup label=\"ACTUAL\"><option value=\""+actual+"\">"+actual+"</option></optgroup>";
      input += "<optgroup label=\"AVAILABLE\">";
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
          genericWarningAlert('Not change a category','fa-user');
        }
      });
    }
  });
}

function updateEmployeeType(id,typeOld, typeNew){
  var data ={
    id_installation: ID_INSTALLATION,
    id_employee: id,
    category: typeNew
  }
  $.ajax({
    url:"/helper/employees/updateCategory",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status)
        genericSuccessAlert('Change category: '+typeOld+' to '+typeNew,'fa-user');
      else
        genericErrorAlert('Error when try to change a category');
    }
  });
}

function editFields(){
  var new_id = nextEmployeeID();
  var tr_beign = "<tr><td></td>";
  var tr_end = "</td>";
  var td_input_id = "<td><input id=\"ed_"+new_id+"\" type=\"text\" name=\"newEmployeeID\" value=\""+new_id+"\" disabled></td>";
  var td_input_name = "<td><input type=\"text\" name=\"newEmployeeName\" placeholder=\"NAME\"></td>";
  var td_input_last_name = "<td><input type=\"text\" name=\"newEmployeeLastName\" placeholder=\"LAST NAME\"></td>";
  var td_input_type = "<td id=\"selectCategories\"></td>";
  var td_input_device = "<td><input type=\"text\" name=\"newEmployeeDevice\" value=\"ANDROID\" disabled></td>";
  var td_buttons = "<td><button onclick=\"saveEmployee("+new_id+")\" class=\"btn btn-primary\" title=\"Save employee\"><i class=\"fa fa-save\"></button></td>";
  listCategoriesEdit(new_id);
  return (tr_beign+td_input_id+td_input_name+td_input_last_name+td_input_type+td_input_device+td_buttons+tr_end);
}

function listCategoriesEdit(id){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/employees/categoriesList",
    type:"POST",
    data: data,
    success: function(data){
      var input = "<select name=\"newEmployeeType\"><optgroup label=\"AVAILABLE\">";
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
  var data = {
    id_installation: ID_INSTALLATION
  }
  var id;
  $.ajax({
    url:"/helper/employees/nextEmployeeId",
    type:"POST",
    data: data,
    async: false,
    success: function(data){
      id = parseInt(data.id_employee.split('-')[1])+1;
    }
  });
  return id;
}

function saveEmployee(id){
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: $('input[name="newEmployeeID"]').val(),
    name: $('input[name="newEmployeeName"]').val().toUpperCase(),
    last_name: $('input[name="newEmployeeLastName"]').val().toUpperCase(),
    category: $('select[name="newEmployeeType"]').val(),
    device: $('input[name="newEmployeeDevice"]').val()
  };
  if(data.worker_name == "")
    genericErrorAlert('Employee name is required');
  else{
    $.ajax({
      url:"/helper/employees/save",
      type:"POST",
      data: data,
      success: function(dat){
        if(dat.status){
          $('#ed_'+id).val("E-"+(nextEmployeeID()));
          $('input[name="newEmployeeName"]').val('');
          var html = "<tr id=\""+data.id_employee+"\"><td><button title=\"History: "+data.name+"\" id=\"history_"+data.id_employee+"\" class=\"btn btn-primary\"><i class=\"fa fa-history\"></button></td><td>"+data.id_employee+"</td><td class=\"cursor-edit\"><spanname>"+data.name+"</spanname></td><td><spantype class=\"cursor-edit\">"+data.category+"</spantype></td><td>"+data.device+"</td>";
          var button = "<td><button onclick=\"deleteEmployee('"+data.id_employee+"')\" class=\"btn btn-danger\" title=\"Delete\"><i class=\"fa fa-trash\"></button></td>";
          
          $.when($(html+button).insertAfter($('#employee_list>tr:first'))).done(function(){
            var id = $('tr#'+data.id_employee+">td");
            editName(id);
            editCategory(id);
          });
          genericSuccessAlert('Success register a employee','fa-user');
        }
        else{
          genericErrorAlert('Error when register a employee');
        }
      }
    });
  }
}

function deleteEmployee(id){
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: id
  };
  
  var gritter_id = $.gritter.add({
    title: "Confirm",
    text: "<h3>¿Could you like delete a employee with id: <b>" + id + "</b>?</h3><button id=\"removeEmployee\" class=\"btn btn-danger\">Delete<span id=\""+id+"\"></span></button><button id=\"cancelremoveEmployee\" class=\"btn btn-primary\">Cancel</button>",
    sticky: true,
    class_name: 'gritter-alert-warning'
  });

  $('#removeEmployee').click(function(){
    $.ajax({
      url:"/helper/employees/delete",
      type:"POST",
      data: data,
      success: function(data){
        if(data.status){
          genericSuccessAlert('Success delete a employee','fa-user');
          $('tr#'+id).remove();
          var reset_id = nextEmployeeID();
          $('#employee_list>tr:first>td:first>input').val("E-"+reset_id);
        }
        else
          genericErrorAlert('Error when delete a employee');
      }
    });
    $.gritter.removeAll();
  });
  $('#cancelremoveEmployee').click(function(){
    $.gritter.removeAll();
  });
}

function historyEvent(id){
  $("#history_" + id).click(function(){
    window.location.href = '/installation/' + ID_INSTALLATION + "/" + id + "?name=" + ADMIN_NAME + "&id=" + ADMIN_ID;
  });
}