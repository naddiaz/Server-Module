function getEmployeesByType(location, name, type){
  var data = {
    location: location,
    name: name,
    type: type.toUpperCase()
  }
  $.ajax({
    url:"/scripts/employeesByType",
    type:"POST",
    data: data,
    success:function(data) {
      $('#select-employees').empty();
      $('#select-employees').multiSelect("destroy");
      for(i in data){
        $('#select-employees').append("<option value=" + data[i].id_person + ">" + data[i].worker_name + " ("+ data[i].id_person + ")</option>");
      }
      ms_employees();
    }
  });
}

function ms_employees(){
  var multiSelectEmployees = 1;
  $('#select-employees').multiSelect({
    keepOrder: true,
    selectableOptgroup: true,
    afterSelect: function(values){
      if(multiSelectEmployees == $('#nEmployees').val()){
        $('#ms-select-employees > .ms-selectable > .ms-list').css("display","none");
      }
      multiSelectEmployees += 1;
    },
    afterDeselect: function(values){
      multiSelectEmployees -= 1;
      if(multiSelectEmployees <= $('#nEmployees').val()){
        $('#ms-select-employees > .ms-selectable > .ms-list').css("display","block");
      }
    }
  });
}