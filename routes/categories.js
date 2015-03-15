var Mongoose = require( 'mongoose' );
var Airport     = Mongoose.model( 'Airport' );
var Type = Mongoose.model('Type');

exports.list =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Type.find({id_airport: airport.id_airport}).exec(function(err,types){
      if(err)
        res.send(err)
      res.send({categories: types});
    });
  });
};

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