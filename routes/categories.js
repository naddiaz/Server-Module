async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Type     = Mongoose.model( 'Type' );

exports.index =  function(req, res){
  Airport.find({}).exec(function(err, airports){
    res.render('categories',
    {
      location: req.params.location,
      name: req.params.name,
      airports: airports
    });
  });
};

exports.list =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Type.find({id_airport: airport.id_airport}).exec(function(err,types){
      if(err)
        res.send(err)
      res.send({categories: types});
    });
  });
};

exports.updateName =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){

    var Types= Type.update({id_airport: airport.id_airport, name: req.body.old_name},{name:req.body.new_name});
    var Tasks = Task.update({id_airport: airport.id_airport, type: req.body.old_name},{type:req.body.new_name},{multi:true});
    var People = Person.update({id_airport: airport.id_airport, worker_type: req.body.old_name},{worker_type:req.body.new_name},{multi:true});

    var data = {
      tasks: Tasks.exec.bind(Tasks),
      types: Types.exec.bind(Types),
      people: People.exec.bind(People)
    };
    async.parallel(data,function(err){
      if(err)
        res.send(err);
      res.send({status: true});
    });
  });
};