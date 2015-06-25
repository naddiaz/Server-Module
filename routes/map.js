exports.home =  function(req, res){
  var id_installation = req.params.id_installation;
  res.render('map',{
    id_installation: id_installation
  });
};
