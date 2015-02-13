$( document ).ready(function(){
  $('.edit_employee').hide();
});

function editable(id){
  $('#ed_'+id).show();
  $('#rigid_'+id).hide();
}

function no_editable(id){
  $('#ed_'+id).hide();
  $('#rigid_'+id).show();
}