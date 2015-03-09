var Mongoose = require( 'mongoose' );
var Airport     = Mongoose.model( 'Airport' );

exports.login = function(req, res){
  res.render('login',{title: 'BLE Tasker'});
};

exports.index =  function(req, res){
  Airport.find({}).sort({ location: 1, name: 1 }).exec(function(err, airports){
    res.render('admin',{title: 'BLE Tasker', airports: airports, location: req.params.location, name: req.params.name, layout: 'layout_internal'});
  });
};
