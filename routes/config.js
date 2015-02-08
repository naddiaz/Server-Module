exports.view_map =  function(req, res){
  res.render('map',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, layout: 'layout_admin'});
};

exports.config_airport = function(req, res){
  res.render('config',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, layout: 'layout_admin'});
};