var Mongoose = require( 'mongoose' );
var Beacon     = Mongoose.model( 'Beacon' );

exports.read_beacon =  function(req, res){
  Beacon.find( function(err, beacons){
    res.render('beacons',{title: 'BLE Tasker', beacons: beacons, layout: 'layout_admin'});
  });
};
