function getInstallationById(id){
  var data = {
    id_installation: id
  }
  var installation;
  $.ajax({
    url:"/helper/installation/getInstallationById",
    type:"POST",
    data: data,
    async: false,
    success:function(request) {
      installation = request;
    }
  });
  return installation.installation;
}