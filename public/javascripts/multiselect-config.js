$(document).ready(function(){
  $('#searching').hide();
  $("input[name='searching']").change(function(){
    $('#searching').show();
    if($('#sr-manual').is(':checked')){
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
    else{
      $('#searching').hide();
    }
  });
});

