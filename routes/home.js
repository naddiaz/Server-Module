var Mongoose = require( 'mongoose' );
var Airport     = Mongoose.model( 'Airport' );

exports.index =  function(req, res){
  Airport.find(function(err, airports){
    if(err)
      res.send(err);
    res.render('home',{airports: airports});
  });
};

exports.help =  function(req, res){
    res.render('help',{airports: airports});
};