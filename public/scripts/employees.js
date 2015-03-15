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
        list.append(html);
        var id = $('tr#'+data.people[i].id_person+">td");
        editName(id);
        editCategory(id);
      }
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
      console.log(data)
      console.log(self)
      var input = "<select>";
      input += "<optgroup label=\"ACTUAL\"><option value=\""+actual+"\">"+actual+"</option></optgroup>";
      input += "<optgroup label=\"DISPONIBLES\">";
      for(i in data.categories){
        input += "<option value=\""+data.categories[i].name.toUpperCase()+"\">"+data.categories[i].name.toUpperCase()+"</option>"
      }
      input += "</optgroup></select>";
      self.html(input);
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