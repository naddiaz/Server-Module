async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');
var Type = Mongoose.model('Type');

exports.index =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var Tasks = Task.find({id_airport: airport.id_airport}).sort({id_task: -1});
    var People = Person.find({id_airport: airport.id_airport});
    var Types = Type.find({id_airport: airport.id_airport});
    var Works = Work.find({id_airport: airport.id_airport}).populate('person task');
    var Airports = Airport.find({});

    var data = {
      tasks: Tasks.exec.bind(Tasks),
      people: People.exec.bind(People),
      types: Types.exec.bind(Types),
      works: Works.exec.bind(Works),
      airports: Airports.exec.bind(Airports)
    };

    async.parallel(data,function(err,results){
      res.render('tasks',
      {
        location: req.params.location,
        name: req.params.name,
        airports: results.airports,
        types: results.types
      });
    });
  });
};

exports.create =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    console.log("HELLO")
    new Task({
      id_airport: airport.id_airport,
      id_task: req.body.id_task,
      id_cell: req.body.id_cell,
      type: req.body.type,
      n_employees: req.body.n_employees,
      priority: req.body.priority,
      description: req.body.description,
    }).save( function( err, tasks ){
      if(err)
        console.log(err)
      res.send(tasks);
    });
  });
};