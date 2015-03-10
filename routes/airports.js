async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');

exports.index =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var Tasks = Task.find({id_airport: airport.id_airport}).sort({id_task: -1});
    var People = Person.find({id_airport: airport.id_airport});
    var Works = Work.find({id_airport: airport.id_airport});
    var Airports = Airport.find({});
    var data = {
      tasks: Tasks.exec.bind(Tasks),
      people: People.exec.bind(People),
      works: People.exec.bind(Works),
      airports: People.exec.bind(Airports)
    };
    async.parallel(data,function(err,results){
      res.send({location: req.params.location, name: req.params.name, people: results.people, tasks: results.tasks, works: results.works});
      //res.render('airport',{location: req.params.location, name: req.params.name, people: results.people, tasks: results.tasks, airports:results.airports});
    });
  });
};
