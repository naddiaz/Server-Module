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
        var html = "<tr><td>"+data.people[i].id_person+"</td><td id=\""+data.people[i].id_person+"\"><span>"+data.people[i].worker_name+"</span></td><td>"+data.people[i].worker_type+"</td><td>"+data.people[i].device_type+"</td>";
        list.append(html);
        $('td#'+data.people[i].id_person).click(function(){
          if($(this).children().prop('nodeName') == 'SPAN'){
            $(this).html("<input type=\"text\" id=\"input_"+$(this).parent().attr('id')+"\" placeholder=\""+$(this).text()+"\" autofocus>");
            $("#input_"+$(this).parent().attr('id')).keypress(function(e) {
              if(e.which == 13) {
                $(this).parent().html("<span>"+$(this).val().toUpperCase()+"</span>");
              }
            });
          }
        })
      }
    }
  });
}

function updateEmployee(){
  
}