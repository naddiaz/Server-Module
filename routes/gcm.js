async = require("async");

var Mongoose = require( 'mongoose' );
var GCM     = Mongoose.model( 'GCMRegistrationID' );

exports.registrationGCM =  function(req, res){
  new GCM({
    id_airport: req.body.id_airport,
    id_person: req.body.id_person,
    id_push: req.body.id_push,
    created_at: Date.now()
  }).save( function( err ){
    if(err)
      res.send(err);
    res.send({status: true});
  });
};