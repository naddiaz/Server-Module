$( document ).ready(function(){
  $('.edit_beacon').hide();
});

function editable(id){
  $('#ed_'+id).show();
  $('#rigid_'+id).hide();
}

function no_editable(id){
  $('#ed_'+id).hide();
  $('#rigid_'+id).show();
}