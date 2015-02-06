var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );

exports.login = function(req, res){
  res.render('login',{title: 'BLE Tasker'});
};

exports.index =  function(req, res){
  res.render('admin',{title: 'BLE Tasker', layout: 'layout_admin'});
};

exports.employee =  function(req, res){
  Person.find( function(err, people){
    res.render('employee',{title: 'BLE Tasker', people: people, layout: 'layout_admin'});
  });
};

exports.create_employee =  function(req, res){
  new Person({
    id_person: req.body.id_person,
    id_push: req.body.id_push,
    worker_name: req.body.worker_name,
    worker_id: req.body.worker_id,
    worker_type: req.body.worker_type,
  }).save( function( err, todo, count ){
    res.redirect( '/admin/employee' );
  });
};

exports.delete_employee =  function(req, res){
  Person.remove({id_person: req.body.id_person}, function(){
    res.redirect('/admin/employee');
  });
};
