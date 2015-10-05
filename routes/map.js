var Async        = require("async");
var Mongoose     = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Employee     = Mongoose.model( 'Employee' );
var Beacon       = Mongoose.model( 'Beacon' );
var Location     = Mongoose.model( 'Location' );

exports.home =  function(req, res){
  var id_installation = req.params.id_installation;
  res.render('map',{
    id_installation: id_installation,
    admin : {
      name: req.query.name,
      id: req.query.id
    }
  });
};

exports.saveBeacons = function(req,res){
  Beacon.find({id_installation:req.body.id_installation}).remove().exec();
  for(i=0; i<req.body.beacons.length; i++){
    console.log(req.body.beacons[i].id_beacon)
    var beacon = new Beacon();
    beacon.id_installation = req.body.id_installation;
    beacon.id_beacon = req.body.beacons[i].id_beacon;
    beacon.location = req.body.beacons[i].location;
    beacon.group = req.body.beacons[i].group;
    beacon.adjacent = req.body.beacons[i].adjacent;
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
}

exports.loadBeacons = function(req,res){
  Beacon.find({id_installation:req.body.id_installation}).exec(function(err,beacons){
    if(!err) {
      res.send({beacons:beacons});
    }
    else {
      res.send({error:err});
    }
  });
}

exports.loadEmployees = function(req,res){
  Employee
    .find({id_installation: req.body.id_installation},{ track: { $slice: -1 }})
    .exec(function(err, employees){
      if(err)
        res.send({status:false});
      res.send({employees: employees});
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
  return {
    lat: 0,
    lng: 0
  };
}

function getEmployeeById(id,employees){
  var k=0;
  while(k<employees.length){
    if(id == employees[k].id_employee){
      return employees[k]
    }
    k++;
  }
  return null;
}

function isSelected(id,employees){
  var k=0;
  while(k<employees.length){
    if(id == employees[k]){
      return true;
    }
    k++;
  }
  return false;
}