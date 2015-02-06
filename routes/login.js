exports.login = function(req, res){
  res.render('login',{title: 'BLE Tasker'});
};

exports.index =  function(req, res){
  res.render('admin',{title: 'BLE Tasker', layout: 'layout_admin'});
};