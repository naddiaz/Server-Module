async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Airport     = Mongoose.model( 'Airport' );
var Cell     = Mongoose.model( 'Cell' );
var Task     = Mongoose.model( 'Task' );
var Distance     = Mongoose.model( 'Distance' );
var Work     = Mongoose.model( 'Work' );
var Localization     = Mongoose.model( 'Localization' );

exports.employeesByType =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).exec(function(err, airport){
    Person.find({id_airport: airport.id_airport, worker_type: req.body.type}).exec(function(err, people){
      res.send(people);
    });
  });
};

exports.employeesByCell =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var rules = [
      {id_airport: airport.id_airport},
      {id_beacon: parseInt(req.body.id_cell)},
      {id_person: {$nin: JSON.parse(req.body.ids_people)}},
      {date: {$gte: new Date(req.body.last_minute)}}
    ]
    Localization.aggregate([
      {$match:
        {
          $and: rules
        }
      },
      {
        $sort:
          {
            date: -1
          }
      },
      {
        $group:
          {
            _id: {id_person : "$id_person"},
            lastDate: { $last: "$date" }
          }
      }
    ], function(err, people){
      res.send(people)
    });
  });
};

exports.employeesData =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).exec(function(err, airport){
    Person.findOne({id_airport: airport.id_airport, id_person: req.body.id_person}).exec(function(err, person){
      res.send(person);
    });
  });
};

exports.employeesByStateAndWork =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).exec(function(err, airport){
    var People = Person.find({id_airport: airport.id_airport, id_person: { $in: req.body.people}});
    var Works = Work.find({id_airport: airport.id_airport}).populate('person task');
    var data = {
      people: People.exec.bind(People),
      works: Works.exec.bind(Works)
    };

    async.parallel(data,function(err,results){
      var order_asign = new Array();
      for(var i=0; i<results.people.length; i++){
        var active = false;
        var count_works = 0;
        for(var j=0; j<results.works.length; j++){
          if(results.works[j].id_person == results.people[i].id_person){
            active = true;
            count_works++;
          }
        }
        if(!active){
          order_asign.unshift({"works":0,"employee":results.people[i]});
        }
        else{
          order_asign.unshift({"works":count_works,"employee":results.people[i]});
        }
      }
      order_asign.sort(orderByWorksAsign);
      res.send({
        order:order_asign
      });
    });
  });
};

function orderByWorksAsign(a,b) {
  if (a.works < b.works)
     return -1;
  if (a.works > b.works)
    return 1;
  return 0;
}

exports.airportData =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).exec(function(err, airport){
    res.send(airport);
  });
};


exports.cellsData =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Cell.find({id_airport: airport.id_airport}, function(err, cells){
      if(err)
        res.send(err);
      res.send(cells);
    });
  });
};

exports.nextCell =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Cell.findOne({id_airport: airport.id_airport}).sort({ field: 'asc', id_cell: -1 }).exec(function(err, last) {
      if(last.id_cell == null)
        res.send({id_cell: 0});
      else
        res.send({id_cell:last.id_cell+1});
    });
  });
};

exports.setCell =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    new Cell({
      id_airport: airport.id_airport,
      id_cell: req.body.cell.id_cell,
      latitude: req.body.cell.latitude,
      longitude: req.body.cell.longitude,
      color: req.body.cell.color
    }).save( function( err, todo, count ){
      res.send({status: true});
    });
  });
};

exports.deleteCell =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Cell.remove({id_airport: airport.id_airport, id_cell: req.body.id_cell}, function(err,cell){
      res.send({status: true});
    });
  });
};

exports.clearGraph = function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Distance.remove({id_airport: airport.id_airport},function(err){
      res.send({status: true});
    });
  });
};

exports.createGraph =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    new Distance({
      id_airport: airport.id_airport,
      cell_origin: req.body.cell.cell_origin,
      cell_end: req.body.cell.cell_end,
      distance: req.body.cell.distance
    }).save( function( err, todo, count ){
      res.send({status: true});
    });
  });
};

exports.adjacentsCells =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Distance.find({id_airport: airport.id_airport, cell_origin: req.body.id_cell}, function(err, cells){
      if(err)
        res.send(err);
      res.send(cells);
    });
  });
};