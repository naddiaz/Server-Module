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
        var html = '<tr><td id="cat_'+name+'"><spanname>'+name.toUpperCase()+'</spanname></td><td><button title="Eliminar categoría: '+name.toUpperCase()+'" class="btn btn-danger" onclick="deleteMessage(\''+name+'\')"><i class="fa fa-trash"></button></td></tr>';
        list.append(html);
        editName("#cat_"+name);
      }
      list.prepend(editFields())
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
            updateMessage($(this).attr('placeholder'),$(this).val().toUpperCase(),$(this).parent());
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

function updateMessage(nameOld,nameNew,parent){
  var gritter_id = $.gritter.add({
    title: "Imporante: Cambio de Nombre",
    text: "<h3>Es importante que confirme este cambio pues afecta tanto a la categoría, como a las categorías de empleados y de tareas que pertenezcan a la misma.</h3><hr><h4>Para más información diríjase a la <a href=\"/help\">ayuda</a></h4><hr><button id=\"changeName\" class=\"btn btn-danger\">Aceptar</button><button id=\"cancelChange\" class=\"btn btn-primary\">Cancelar</button>",
    sticky: true,
    class_name: 'gritter-alert-warning'
  });

  $('#changeName').click(function(){
    $.gritter.remove(gritter_id);
    updateCategory(nameOld,nameNew);
  });
  $('#cancelChange').click(function(){
    parent.html("<spanname>"+nameOld+"</spanname>");
    $.gritter.removeAll();
  });
}

function editFields(){
  var td_input_name = '<tr><td><input id="ed_cat" type="text" name="categoryName" placeholder="NOMBRE"></td>';
  var td_buttons = "<td><button onclick=\"saveCategory()\" class=\"btn btn-primary\" title=\"Registrar categoría\"><i class=\"fa fa-save\"></button></td></tr>";
  return (td_input_name+td_buttons);
}

function saveCategory(){
  var cat = $('#ed_cat').val().toUpperCase();
  if(cat != ''){
    var data ={
      location: LOCATION,
      name: NAME,
      category_name: cat
    }
    $.ajax({
      url:"/categories/create",
      type:"POST",
      data: data,
      success: function(data){
        if(data.status){
          genericSuccessAlert('Se ha creado la categoría '+cat+' correctamente','th-list');
          var html = '<tr><td id="cat_'+cat+'"><spanname>'+cat.toUpperCase()+'</spanname></td><td><button title="Eliminar categoría: '+cat.toUpperCase()+'" class="btn btn-danger" onclick="deleteCategory(\''+cat+'\')"><i class="fa fa-trash"></button></td></tr>';
          $('#categories_list').append(html);
          editName("#cat_"+cat);
          $('#ed_cat').val('');
        }
        else
          genericErrorAlert('Ha habido un error al cambiar el nombre, por favor, inténtelo de nuevo.');
      }
    });
  }
  else{
    genericWarningAlert('Es necesario indicar el nombre de la categoría');
  }
}

function deleteMessage(category){
  var gritter_id = $.gritter.add({
    title: "Imporante: Eliminación",
    text: "<h3>Es importante que confirme este cambio pues afecta tanto a la categoría, como a las categorías de empleados y de tareas que pertenezcan a la misma.</h3><hr><h4>Para más información diríjase a la <a href=\"/help\">ayuda</a></h4><hr><button id=\"deleteCategory\" class=\"btn btn-danger\">Aceptar</button><button id=\"cancelDelete\" class=\"btn btn-primary\">Cancelar</button>",
    sticky: true,
    class_name: 'gritter-alert-warning'
  });

  $('#deleteCategory').click(function(){
    $.gritter.remove(gritter_id);
    deleteCategory(category);
  });
  $('#cancelDelete').click(function(){
    $.gritter.removeAll();
  });
}

function deleteCategory(category){
  var data ={
    location: LOCATION,
    name: NAME,
    category_name: category
  }
  $.ajax({
    url:"/categories/delete",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status){
        genericSuccessAlert('Se ha eliminado la categoría '+category+' correctamente','th-list');
        $('#categories_list>tr>td#cat_'+category).parent().remove();
      }
      else
        genericErrorAlert('Ha habido un error al eliminar la categoría, por favor, inténtelo de nuevo.');
    }
  });
}