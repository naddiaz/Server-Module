async = require("async");

var Mongoose = require( 'mongoose' );
var Airport     = Mongoose.model( 'Airport' );
var Localization     = Mongoose.model( 'Localization' );
var Person     = Mongoose.model( 'Person' );
var Cell     = Mongoose.model( 'Cell' );
var Beacon     = Mongoose.model( 'Beacon' );
var HashRegistration = Mongoose.model('HashRegistration');

exports.create =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    new Localization({
      id_airport: airport.id_airport,
      id_person: req.body.id_person,
      id_beacon: req.body.id_beacon,
      rssi: req.body.rssi,
      date: Date.now()
    }).save( function( err ){
      if(err)
        res.send(err);
      res.send({status: true});
    });
  });
};

exports.saveLocation =  function(req, res){
  HashRegistration.findOne({hash:req.body.hash}).exec(function(err, hash){
    if(err)
      res.send({status:false});
    else if(hash == null)
      res.send({status:false});
    else{
      new Localization({
        id_airport: hash.id_airport,
        id_person: hash.id_person,
        id_beacon: req.body.id_beacon,
        rssi: req.body.rssi,
        date: Date.now()
      }).save( function( err ){
        if(err)
          res.send(err);
        res.send({status: true});
      });
    }
  });
}

exports.index = function(req, res){
  res.setLocale('en');
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var People = Person.findOne({id_airport: airport.id_airport,id_person:req.params.id_person});
    var Airports = Airport.find({});
    var data = {
      people: People.exec.bind(People),
      airports: Airports.exec.bind(Airports)
    };
    async.parallel(data,function(err,results){
      if(results.people == null){
        res.render('history',{
          airports: results.airports,
          location: req.params.location,
          name: req.params.name,
          worker_name: null
        });
      }
      else{
        res.render('history',{
          airports: results.airports,
          location: req.params.location,
          name: req.params.name,
          person: results.people
        });
      }
    });
  });
};


exports.history = function(req, res){
  res.setLocale('en');
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Localization.find({id_airport: airport.id_airport,id_person:req.body.id_person},{}, { sort: { 'date' : 1 } }).exec(function(err,locale){
      /*
        Listado de dispositivos quedando con el de menor RSSI en cada localización simultánea
      */

      if(locale.length > 0){
        var position = new Array();
        position.push({id_beacon:locale[0].id_beacon,date:locale[0].date});
        var prev = 0;

        for(var i=1; i<locale.length; i++){
          if(locale[prev].id_beacon != locale[i].id_beacon && locale[prev].date.toString() == locale[i].date.toString()){
            if(parseInt(locale[prev].rssi) <= parseInt(locale[i].rssi)){
              position.push({id_beacon:locale[prev].id_beacon,date:locale[prev].date});
            }
            else{
              position.push({id_beacon:locale[i].id_beacon,date:locale[i].date});
            }
          }
          else{
            position.push({id_beacon:locale[i].id_beacon,date:locale[i].date});
          }
          prev++;
        }

        /*
          Obteniendo la frecuencia para cada id_beacons seguido igual
        */
        var frequency = new Array();
        var actual = position[0].id_beacon;
        var count = -1;

        for(var i=0; i<position.length; i++){
          count++;
          if(actual != position[i].id_beacon){
            frequency.push({id_beacon:actual,frequency:count});
            actual = position[i].id_beacon;
            count = 0;
          }
        }
        if(count > 0){
          frequency.push({id_beacon:actual,frequency:count});
        }

        /*
          Tomamos como puntos significativos todos aquellos que superen la media de la frecuencia
          y volvemos a agrupar, para hacer coincidir los grupos
        */
        var points = groupedUpToAvg(frequency, position.length/frequency.length);
        console.log("SIGNIFICANT POINTS");
        console.log(points);
        
        /* Volver a filtrar por el 60% de media de los significativos y agrupar */

        var final_points = groupedUpToAvg(points, (getPointsFrequency(points)/points.length * 0.4));
        console.log("FINAL POINTS");
        console.log(final_points);

        /*
          Para el mapa de calor reagrupamos indistintamente del orden,
          solo nos interesa la frecuencia por punto
        */
        console.log("HOT POINTS")
        var order_points = final_points.slice();
        order_points.sort(function(a,b){
          if(a.id_beacon<b.id_beacon) return -1;
          if(a.id_beacon>b.id_beacon) return 1
          return 0;
        });
        
        var prev = 0;
        var acc = order_points[0].frequency;
        var hot_points = new Array();
        for(var i=1; i<order_points.length; i++){
          if(order_points[prev].id_beacon == order_points[i].id_beacon){
            acc += order_points[i].frequency;
          }
          else{
            hot_points.push({id_beacon:order_points[prev].id_beacon,frequency:acc});
            acc = order_points[i].frequency;
          }
          prev++;
        }
        hot_points.push({id_beacon:order_points[prev].id_beacon,frequency:acc});
        console.log(hot_points);

        res.send({sig_points: final_points, hot_points: hot_points});
      }
      else{
        res.send({error:'nodata'});
      }
    });
  });
};

exports.beaconToLatLon = function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Beacon.findOne({id_airport: airport.id_airport,id_beacon:req.body.id_beacon}).exec(function(err,beacon){
      Cell.findOne({id_airport: airport.id_airport,id_cell:beacon.id_cell}).select('latitude longitude').exec(function(err,cell){
        if(err)
          res.send(err)
        res.send(cell);
      });
    })
  });
};

function groupedUpToAvg(arr,avg){
  var avg_points = new Array();
    for(i in arr){
      if(arr[i].frequency >= avg){
        avg_points.push({id_beacon:arr[i].id_beacon,frequency:arr[i].frequency});
      }
    }
    
    var points = new Array();
    var acc = 0;
    for(var i=0; i<avg_points.length; i++){
      if(i < avg_points.length-1){
        if(avg_points[i].id_beacon == avg_points[i+1].id_beacon){
          acc += avg_points[i].frequency;
        }
        else{
          acc += avg_points[i].frequency;
          points.push({id_beacon:avg_points[i].id_beacon,frequency:acc});
          acc = 0;
        }
      }
      else{
        acc += avg_points[i].frequency;
        points.push({id_beacon:avg_points[i].id_beacon,frequency:acc});
      }
    }
    return points;
}

function getPointsFrequency(arr){
  var frequency = 0;
  for(var i=0; i<arr.length; i++){
    frequency += arr[i].frequency;
  }
  return frequency;
}