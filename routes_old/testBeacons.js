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
    rssi: req.body.rssi,
    timestamp: req.body.timestamp,
    date: Date(req.body.timestamp),
  }).save( function( err, todo, count ){
    res.redirect( '/admin/config/testBeacons' );
  });
};