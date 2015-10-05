var Mongoose = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Location     = Mongoose.model( 'Location' );
var Employee     = Mongoose.model( 'Employee' );
var Beacon       = Mongoose.model( 'Beacon' );
var Signal       = require('./location/signal');
var Calc         = require('./location/calc');

exports.send =  function(req, res){
  var bcns = req.body.beacons;
  Beacon.find({id_installation:req.body.id_installation}).select('id_beacon location').exec(function(err,beacons){
    var calc = Calc();
    for(var j=0; j<bcns.length; j++){
      var bcn = getLatLngBeaconById(bcns[j].id, beacons);
      var signal = Signal(bcn.lat, bcn.lng, bcns[j].powerDbm, -22);
      calc.addSignal(signal);
    }
    var solve = calc.solve();
    Employee.update(
      { id_employee: req.body.id_employee },
      {
        update_at : Date.now(),
        $push: {
          track: {
            location: {
              latitude: solve.x,
              longitude: solve.y
            },
            register_at: Date.now()
          }
        }
      },
      function(err,employee){
        if(err)
          res.send({status:false});
        res.send({state:true});
      }
    );
  });
}

function getLatLngBeaconById(id,beacons){
  var k=0;
  while(k<beacons.length){
    if(id == beacons[k].id_beacon){
      return{
        lat: beacons[k].location.latitude,
        lng: beacons[k].location.longitude
      }
    }
    k++;
  }
  return null;
}

exports.test =  function(req, res){
  res.render('test_location_send',{
    admin: {
      name: "Will",
      id: "A-1"
    },
    id_installation: "A0001",
    id_employee: req.params.id
  });
}