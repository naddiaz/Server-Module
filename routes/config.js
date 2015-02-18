async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Airport     = Mongoose.model( 'Airport' );
var Cell     = Mongoose.model( 'Cell' );
var Task     = Mongoose.model( 'Task' );
var Distance     = Mongoose.model( 'Distance' );
var Type     = Mongoose.model( 'Type' );

function callback(err, item){
  console.log("ITEM" + item);
}

exports.view_map =  function(req, res){
  res.render('map',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, layout: 'layout_admin'});
};

exports.index =  function(req, res){
  res.render('config',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, layout: 'layout_admin'});
};

exports.config_airport = function(req, res, callback){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var Tasks = Task.find({id_airport: airport.id_airport});
    var Types = Type.find({id_airport: airport.id_airport});
    var People = Person.find({id_airport: airport.id_airport});
    var data = {
      tasks: Tasks.exec.bind(Tasks),
      types: Types.exec.bind(Types),
      people: Types.exec.bind(People)
    };
    async.parallel(data,function(err,results){
      res.render('task',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, people: results.people, tasks: results.tasks, types: results.types, layout: 'layout_admin'});
    });
  });
};

exports.get_airport =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).exec(function(err, airport){
    res.send(airport);
  });
};

exports.get_cells =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Cell.find({id_airport: airport.id_airport}, function(err, cells){
      if(err)
        res.send(err);
      res.send(cells);
    });
  });
};

exports.get_next_cell_id =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Cell.findOne({id_airport: airport.id_airport}).sort({ field: 'asc', id_cell: -1 }).exec(function(err, last) {
      if(last == null)
        res.send({id_cell: 0});
      else
        res.send({id_cell:last.id_cell+1});
    });
  });
};

exports.set_cell =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Cell({
      id_airport: airport.id_airport,
      id_cell: req.body.id_cell,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      color: req.body.color
    }).save( function( err, todo, count ){
      res.send({status: true});
    });
  });
};

exports.delete_cell =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Cell.remove({id_airport: airport.id_airport, id_cell: req.body.id_cell}, function(){
      res.send({status: true});
    });
  });
};

exports.graph_clear = function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Distance.remove({id_airport: airport.id_airport},function(err){
      res.send({status: true});
    });
  });
};

exports.graph_cell =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    new Distance({
      id_airport: airport.id_airport,
      cell_origin: req.body.cell_origin,
      cell_end: req.body.cell_end,
      distance: req.body.distance
    }).save( function( err, todo, count ){
      res.send({status: true});
    });
  });
};
