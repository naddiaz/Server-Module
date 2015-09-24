$(document).ready(function(){
  categoriesList();
});

function categoriesList(){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/categories/categoriesList",
    type:"POST",
    data: data,
    success:function(data) {
      var list = $('#categories_list');
      for(i in data.categories){
        var name = data.categories[i].name;
        var html = '<tr><td id="cat_'+name+'"><spanname>'+name.toUpperCase()+'</spanname></td><td><button title="Delete: '+name.toUpperCase()+'" class="btn btn-danger" onclick="deleteMessage(\''+name+'\')"><i class="fa fa-trash"></button></td></tr>';
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
    id_installation: ID_INSTALLATION,
    old_name: nameOld,
    new_name: nameNew
  }
  $.ajax({
    url:"/helper/categories/updateCategory",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status)
        genericSuccessAlert('Change category name: '+nameOld+' to '+nameNew,'th-list');
      else
        genericErrorAlert('Error when try to change category name');
    }
  });
}

function updateMessage(nameOld,nameNew,parent){
  var gritter_id = $.gritter.add({
    title: "Confirm",
    text: "<h3>Are you sure?</h3><hr><button id=\"changeName\" class=\"btn btn-danger\">Accept</button><button id=\"cancelChange\" class=\"btn btn-primary\">Cancel</button>",
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
  var td_input_name = '<tr><td><input id="ed_cat" type="text" name="categoryName" placeholder="NAME"></td>';
  var td_buttons = "<td><button onclick=\"saveCategory()\" class=\"btn btn-primary\" title=\"Save\"><i class=\"fa fa-save\"></button></td></tr>";
  return (td_input_name+td_buttons);
}

function saveCategory(){
  var cat = $('#ed_cat').val().toUpperCase();
  if(cat != ''){
    var data ={
      id_installation: ID_INSTALLATION,
      name: cat
    }
    $.ajax({
      url:"/helper/categories/save",
      type:"POST",
      data: data,
      success: function(data){
        if(data.status){
          genericSuccessAlert('Category: '+cat+' is create','th-list');
          var html = '<tr><td id="cat_'+cat+'"><spanname>'+cat.toUpperCase()+'</spanname></td><td><button title="Delete: '+cat.toUpperCase()+'" class="btn btn-danger" onclick="deleteCategory(\''+cat+'\')"><i class="fa fa-trash"></button></td></tr>';
          $('#categories_list').append(html);
          editName("#cat_"+cat);
          $('#ed_cat').val('');
        }
        else
          genericErrorAlert('Error when try to save a new category');
      }
    });
  }
  else{
    genericWarningAlert('Category name is required');
  }
}

function deleteMessage(category){
  var gritter_id = $.gritter.add({
    title: "Confirm",
    text: "<h3>Are you sure?</h3><hr><button id=\"deleteCategory\" class=\"btn btn-danger\">Aceptar</button><button id=\"cancelDelete\" class=\"btn btn-primary\">Cancelar</button>",
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

function deleteCategory(name){
  var data ={
    id_installation: ID_INSTALLATION,
    name: name
  }
  $.ajax({
    url:"/helper/categories/delete",
    type:"POST",
    data: data,
    success: function(data){
      if(data.status){
        genericSuccessAlert('Delete category: '+name,'th-list');
        $('#categories_list>tr>td#cat_'+name).parent().remove();
      }
      else
        genericErrorAlert('Error when try to delete a category');
    }
  });
}