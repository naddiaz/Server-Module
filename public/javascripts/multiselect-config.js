$(document).ready(function(){
  $('#searching').hide();
  
  $("input[name='searching']").change(function(){
    $('#searching').show();
    if($('#sr-manual').is(':checked')){
      ms_employees();
    }
    else{
      $('#searching').hide();
    }
  });

  $('#task_type').change(function(event){
    var task_type = {task_type: $(this).val().toUpperCase()};
    $.ajax({
      url:"/admin/config/" + LOCATION + "/" + NAME + "/employee/filter",
      type:"POST",
      data: task_type,
      success:function(data) {
        $('#select-employees').empty();
        $('#select-employees').multiSelect("destroy");
        for(i in data){
          $('#select-employees').append("<option value=" + data[i].id_person + ">" + data[i].worker_name + "</option>");
        }
        ms_employees();
      }
    });
  });
});

function ms_employees(){
  var multiSelectEmployees = 1;
  $('#select-employees').multiSelect({
    keepOrder: true,
    selectableOptgroup: true,
    afterSelect: function(values){
      if(multiSelectEmployees == $('#n_employees').val()){
        $('#ms-select-employees > .ms-selectable > .ms-list').css("display","none");
      }
      multiSelectEmployees += 1;
    },
    afterDeselect: function(values){
      multiSelectEmployees -= 1;
      if(multiSelectEmployees <= $('#n_employees').val()){
        $('#ms-select-employees > .ms-selectable > .ms-list').css("display","block");
      }
    }
  });
}