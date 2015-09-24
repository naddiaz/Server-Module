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

var Signal = require('./location/signal');
var Calc = require('./location/calc');

exports.loadEmployees = function(req,res){
  var Locations = Location.find({id_installation:req.body.id_installation}).select('id_employee beacons detected_at').sort({detected_at: -1});
  var Beacons = Beacon.find({id_installation:req.body.id_installation}).select('id_beacon location');
  var Employees = Employee.find({id_installation:req.body.id_installation}).select('id_employee name last_name category');
  var data = {
    locations: Locations.exec.bind(Locations),
    beacons: Beacons.exec.bind(Beacons),
    employees: Employees.exec.bind(Employees)
  };
  async.parallel(data,function(err,results){
    if(!err){
      var locations = results.locations;
      var beacons = results.beacons;
      var employees = results.employees;

      var data = [];
      var selected = [];

      for(var i=0; i<locations.length; i++){
        var calc = Calc();
        for(var j=0; j<locations[i].beacons.length; j++){
          var bcn = getLatLngBeaconById(locations[i].beacons[j].id,beacons);
          var signal = Signal(bcn.lat, bcn.lng,locations[i].beacons[j].powerDbm,-22);
          calc.addSignal(signal);
        }
        if(!isSelected(locations[i].id_employee,selected)){
          selected.push(locations[i].id_employee);
          data.push({location:calc.solve(),id:locations[i].id_employee, data:getEmployeeById(locations[i].id_employee,employees)});
        }
      }
      res.send({employees:data});
    }
    res.send({error:err});  
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