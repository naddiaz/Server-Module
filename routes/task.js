var Mongoose = require( 'mongoose' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );

exports.create_task =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Task({
      id_airport: airport.id_airport,
      id_task: req.body.id_task,
      id_cell: req.body.id_cell_hide,
      type: req.body.task_type,
      priority: req.body.task_priority,
      description: req.body.task_description,
    }).save( function( err, todo, count ){
      if(err)
        console.log(err)
      res.redirect( '/admin/config/' + req.params.location + '/' + req.params.name);
    });
  });
};