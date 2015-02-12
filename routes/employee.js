var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Airport     = Mongoose.model( 'Airport' );

exports.read_employee =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Person.find({id_airport: airport.id_airport}, function(err, people){
      res.render('employee',{title: 'BLE Tasker', people: people, location: req.params.location, name: req.params.name, layout: 'layout_admin'});
    });
  });
};

exports.create_employee =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Person({
      id_airport: airport.id_airport,
      id_person: req.body.id_person,
      id_push: req.body.id_push,
      worker_name: req.body.worker_name,
      worker_id: req.body.worker_id,
      worker_type: req.body.worker_type,
    }).save( function( err, todo, count ){
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/employees' );
    });
  });
};

exports.update_employee =  function(req, res){

  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var conditions = {id_airport: airport.id_airport, id_person: req.body.id_person_old};
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
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/employees' );
    });
  });
};

exports.delete_employee =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Person.remove({id_airport: airport.id_airport, id_person: req.body.id_person}, function(){
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name + '/employees' );
    });
  });
};


function emptyString(value){
  if(value != "")
    return false;
  return true;
}