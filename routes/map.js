exports.view_map =  function(req, res){
  res.render('map',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, layout: 'layout_admin'});
};