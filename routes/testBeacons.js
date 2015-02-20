var Mongoose = require( 'mongoose' );
var TestBeacons     = Mongoose.model( 'TestBeacons' );

exports.read_testBeacons =  function(req, res){
  TestBeacons.find(function(err, testBeacons){
    res.render('testBeacons',{title: 'BLE Tasker', testBeacons: testBeacons, layout: 'layout_admin'});
  });
};

exports.create_testBeacons =  function(req, res){
  console.log(req.body)
  new TestBeacons({
    id_beacon: req.body.id_beacon,
    mac: req.body.mac,
    timestamp: req.body.timestamp,
    rssi: req.body.rssi,
    avg_rssi: req.body.avg_rssi,
    distance: req.body.distance
  }).save( function( err, todo, count ){
    res.redirect( '/admin/config/testBeacons' );
  });
};