var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Airport     = Mongoose.model( 'Airport' );
var Cell     = Mongoose.model( 'Cell' );
var Task     = Mongoose.model( 'Task' );

exports.view_map =  function(req, res){
  res.render('map',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, layout: 'layout_admin'});
};

exports.config_airport = function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Task.find({id_airport: airport.id_airport}, function(err, tasks){
      res.render('config',{title: 'BLE Tasker', location: req.params.location, name: req.params.name, tasks: tasks, layout: 'layout_admin'});
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
    }).save();
  });
};

exports.delete_cell =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    Cell.remove({id_airport: airport.id_airport, id_cell: req.body.id_cell}, function(){});
  });
};