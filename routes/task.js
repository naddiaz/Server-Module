async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Type     = Mongoose.model( 'Type' );


exports.read_tasks = function(req, res, callback){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var Tasks = Task.find({id_airport: airport.id_airport}).sort({id_task: -1});
    var Types = Type.find({id_airport: airport.id_airport});
    var People = Person.find({id_airport: airport.id_airport});
    var data = {
      tasks: Tasks.exec.bind(Tasks),
      types: Types.exec.bind(Types),
      people: Types.exec.bind(People)
    };
    async.parallel(data,function(err,results){
      res.render('task',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, people: results.people, tasks: results.tasks, types: results.types, layout: 'layout_admin'});
    });
  });
};

exports.create_task =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Task({
      id_airport: airport.id_airport,
      id_task: req.body.id_task,
      id_cell: req.body.id_cell,
      type: req.body.type,
      priority: req.body.priority,
      description: req.body.description,
    }).save( function( err, tasks ){
      if(err)
        console.log(err)
      res.send(tasks);
    });
  });
};
