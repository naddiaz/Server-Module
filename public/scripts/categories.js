$(document).ready(function(){
  categoriesList();
});

function categoriesList(){
  var data = {
    location: LOCATION,
    name: NAME
  }
  $.ajax({
    url:"/categories/list",
    type:"POST",
    data: data,
    success:function(data) {
      var list = $('#categories_list');
      for(i in data.categories){
        var name = data.categories[i].name;
        var html = '<tr><td id="cat_'+name+'"><spanname>'+name.toUpperCase()+'</spanname></td><td><button title="Eliminar categoría: '+name.toUpperCase()+'" class="btn btn-danger" onclick="deleteCategory(\''+name+'\')"><i class="fa fa-trash"></button></td></tr>';
        list.append(html);
        editName("#cat_"+name);
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
            updateMessage($(this).attr('placeholder'),$(this).val().toUpperCase());
            $(this).parent().html("<spanname>"+$(this).val().toUpperCase()+"</spanname>");
          }
          else
            $(this).parent().html("<spanname>"+old_value+"</spanname>");                  
        }
      });
    }
  });
}

function updateCategory(nameOld, nameNew){
  var data ={
    location: LOCATION,
    name: NAME,
    old_name: nameOld,
    new_name: nameNew
  }
  $.ajax({
    url:"/categories/update/name",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status)
        genericSuccessAlert('Se ha cambiado el nombre de '+nameOld+' por '+nameNew,'th-list');
      else
        genericErrorAlert('Ha habido un error al cambiar el nombre, por favor, inténtelo de nuevo.');
    }
  });
}

function updateMessage(nameOld,nameNew){
  var gritter_id = $.gritter.add({
    title: "Confirmación Importante",
    text: "<h3>Es importante que confirme este cambio pues afecta tanto a la categoría en sí, como a los empleados y tareas que sean de dicha categoría.</h3><hr><h4>Puede suceder que existan tareas asignadas para esta categoría y también cambiará, pero únicamente su categoría, la descripción seguirá siendo la misma y puede perder la coherencia</h4><hr><button id=\"changeName\" class=\"btn btn-danger\">Cambiar</button><button id=\"cancelChange\" class=\"btn btn-primary\">Cancelar</button>",
    sticky: true,
    class_name: 'gritter-alert-warning'
  });

  $('#changeName').click(function(){
    $.gritter.remove(gritter_id);
    updateCategory(nameOld,nameNew);
  });
  $('#cancelChange').click(function(){
    $.gritter.removeAll();
  });
}