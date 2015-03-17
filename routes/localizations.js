async = require("async");

var Mongoose = require( 'mongoose' );
var Airport     = Mongoose.model( 'Airport' );
var Localization     = Mongoose.model( 'Localization' );
var Person     = Mongoose.model( 'Person' );

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

exports.index = function(req, res){
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
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Localization.find({id_airport: airport.id_airport,id_person:req.body.id_person},{}, { sort: { 'date' : 1 } }).exec(function(err,locale){
      /*
        Listado de dispositivos quedando con el de menor RSSI en cada localización simultánea
      */
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
      console.log(position);

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
      console.log(frequency);

      console.log(position.length/frequency.length)

      /*
        Tomamos como puntos significativos todos aquellos que superen la media de la frecuencia
        y volvemos a agrupar, para hacer coincidir los grupos
      */
      var avg_points = new Array();
      for(i in frequency){
        if(frequency[i].frequency >=position.length/frequency.length){
          avg_points.push({id_beacon:frequency[i].id_beacon,frequency:frequency[i].frequency});
        }
      }
      console.log(avg_points);
      
      var points = new Array();
      var prev = 0;
      var frequency_acc = avg_points[0].frequency;
      for(var i=1; i<avg_points.length; i++){
        if(avg_points[prev].id_beacon == avg_points[i].id_beacon){
          frequency_acc += avg_points[i].frequency;
        }
        else{
          points.push({id_beacon:avg_points[prev].id_beacon,frequency:frequency_acc});
          frequency_acc = avg_points[i+1].frequency;
        }
        prev++;
      }
      points.push({id_beacon:avg_points[prev].id_beacon,frequency:frequency_acc});
      console.log(points)
      res.send(locale);
    });
  });
};