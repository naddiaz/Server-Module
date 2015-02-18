var Mongoose = require( 'mongoose' );
var Work     = Mongoose.model( 'Work' );
var Airport     = Mongoose.model( 'Airport' );

exports.create_work = function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Work({
      id_airport: airport.id_airport,
      id_person: req.body.id_person,
      id_task: req.body.id_task,
      state: 'asign',
      created_at: Date.now(),
      asign_at: Date.now()
    }).save( function( err, works ){
      if(err)
        console.log(err)
      res.send(works);
    });
  });
}