$(document).ready(function(){
  history(LOCATION,NAME);
});

function history(location, name){
  var data = {
    location: LOCATION,
    name: NAME,
    id_person: $('#id_person').attr('data')
  }
  console.log(data);
  $.ajax({
    url:"/localizations/history",
    type:"POST",
    data: data,
    success:function(data) {
    }
  });
}