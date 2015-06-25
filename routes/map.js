var Mongoose = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Beacon       = Mongoose.model( 'Beacon' );

exports.home =  function(req, res){
  var id_installation = req.params.id_installation;
  res.render('map',{
    id_installation: id_installation
  });
};

exports.saveBeacons = function(req,res){
  Installation.findOne({id_installation:req.body.id_installation}).exec(function(err,installation){
    Beacon.find({installation: installation}).remove().exec();
    for(i=0; i<req.body.beacons.length; i++){
      console.log(req.body.beacons[i].id_beacon)
      var beacon = new Beacon();
      beacon.id_beacon = req.body.beacons[i].id_beacon;
      beacon.location = req.body.beacons[i].location;
      beacon.group = req.body.beacons[i].group;
      beacon.adjacent = req.body.beacons[i].adjacent;
      beacon.installation = installation;
      beacon.save(function(err,beacon) {
        if(!err) {
          console.log("Beacon created: " + beacon.id_beacon);
          res.send({error:false});
        }
        else {
          console.log("Error: could not save beacon " + beacon.id_beacon);
          res.send({error:err});
        }
      });
    }
  });
}

exports.loadBeacons = function(req,res){
  Installation.findOne({id_installation:req.body.id_installation}).exec(function(err,installation){
    Beacon.find({installation: installation}).exec(function(err,beacons){
      if(!err) {
        res.send({beacons:beacons});
      }
      else {
        res.send({error:err});
      }
    });
  });
}