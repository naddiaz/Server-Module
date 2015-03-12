async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Work     = Mongoose.model( 'Work' );
var Airport     = Mongoose.model( 'Airport' );

exports.create = function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){

    var Tasks = Task.findOne({id_airport: airport.id_airport,id_task: req.body.id_task});
    var People = Person.findOne({id_airport: airport.id_airport,id_person:req.body.id_person});
    var data = {
      tasks: Tasks.exec.bind(Tasks),
      people: People.exec.bind(People)
    };
    async.parallel(data,function(err,results){
      new Work({
        id_airport: airport.id_airport,
        id_person: req.body.id_person,
        id_task: req.body.id_task,
        state: 'asign',
        created_at: Date.now(),
        asign_at: Date.now(),
        person: results.people._id,
        task: results.tasks._id
      }).save( function( err, works ){
        if(err)
          console.log(err)
        res.send(works);
      });
    });
  });
}