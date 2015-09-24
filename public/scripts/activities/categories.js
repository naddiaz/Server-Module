(function(){
  var data = {
    id_installation: ID_INSTALLATION
  }
  $.ajax({
    url:"/helper/categories/categoriesList",
    type:"POST",
    data: data,
    success:function(data) {
      var categories = $('#categories');
      for(i in data.categories){
        categories.append("<option value='" + data.categories[i].name + "'>" + data.categories[i].name + "</option>");
      }
    }
  });
})();