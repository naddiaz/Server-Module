var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Airport     = Mongoose.model( 'Airport' );

exports.read_employee =  function(req, res){
  var id = getAirport(req.params.location,req.params.name);
  
  Person.find( {id_airport: id}, function(err, people){
    res.render('employee',{title: 'BLE Tasker', people: people, location: req.params.location, name: req.params.name, layout: 'layout_admin'});
  });
};

exports.create_employee =  function(req, res){
  var id = getAirport(req.params.location,req.params.name);
  new Person({
    id_airport: id,
    id_person: req.body.id_person,
    id_push: req.body.id_push,
    worker_name: req.body.worker_name,
    worker_id: req.body.worker_id,
    worker_type: req.body.worker_type,
  }).save( function( err, todo, count ){
    res.redirect( '/admin/#{req.params.location}/#{req.params.name}/employee' );
  });
};

exports.update_employee =  function(req, res){

  var conditions = {id_person: req.body.id_person_old};
  var query = {};
  if(!emptyString(req.body.id_person))
    query.id_person = req.body.id_person
  if(!emptyString(req.body.id_push))
    query.id_push = req.body.id_push
  if(!emptyString(req.body.worker_id))
    query.worker_id = req.body.worker_id
  if(!emptyString(req.body.worker_name))
    query.worker_name = req.body.worker_name
  if(!emptyString(req.body.worker_type))
    query.worker_type = req.body.worker_type
  
  Person.update(conditions, query, function(){
    res.redirect('/admin/employee');
  });
};

exports.delete_employee =  function(req, res){
  Person.remove({id_person: req.body.id_person}, function(){
    res.redirect('/admin/employee');
  });
};

function getAirport(location,name){
  var id = null;
  Airport.findOne({location: location, name: name }, function(err, airport){
    id = airport.id_airport;
  });
  return id;
}

function emptyString(value){
  if(value != "")
    return false;
  return true;
}