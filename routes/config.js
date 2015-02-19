async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Airport     = Mongoose.model( 'Airport' );
var Cell     = Mongoose.model( 'Cell' );
var Task     = Mongoose.model( 'Task' );
var Distance     = Mongoose.model( 'Distance' );
var Work     = Mongoose.model( 'Work' );

function callback(err, item){
  console.log("ITEM" + item);
}

exports.view_map =  function(req, res){
  res.render('map',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, layout: 'layout_admin'});
};

exports.index =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Work.find({id_airport: airport.id_airport}).populate('person task').exec(function(err,works){
        res.render('config',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, works: works, layout: 'layout_admin'});
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

exports.get_adjacents_cells =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Distance.find({id_airport: airport.id_airport, cell_origin: req.body.id_cell}, function(err, cells){
      if(err)
        res.send(err);
      res.send(cells);
    });
  });
};
