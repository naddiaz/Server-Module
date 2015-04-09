async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');
var Type = Mongoose.model('Type');
var HashRegistration = Mongoose.model('HashRegistration');

exports.index =  function(req, res){
  Airport.find({}).exec(function(err, airports){
    res.render('employees',
    {
      location: req.params.location,
      name: req.params.name,
      airports: airports
    });
  });
};

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

function intToHex(i){
    return ((i>>24)&0xFF).toString(16) + 
           ((i>>16)&0xFF).toString(16) + 
           ((i>>8)&0xFF).toString(16) + 
           (i&0xFF).toString(16);
}

function hashCalculate(id_airport,id_person,name,date){
  var hash = 1;
  hash = hash * 11 + id_airport;
  hash = hash * 17 + id_person.hashCode();
  hash = hash * 31 + name.hashCode();
  hash = hash * 13 + date.toString().hashCode();
  return intToHex(hash);
}

exports.list =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var People = Person.find({id_airport: airport.id_airport}, {}, { sort: { 'created_at' : -1 } }, function(err, people) {
      res.send({
        people: people
      });
    });
  });
};

exports.updateName =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var conditions = {id_airport: airport.id_airport, id_person: req.body.id_person};
    var query = {};
    query.worker_name = req.body.worker_name;
    Person.update(conditions, query, function(err,person){
      if(err)
        res.send(err);
      res.send({status: true});
    });
  });
};

exports.updateType =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var conditions = {id_airport: airport.id_airport, id_person: req.body.id_person};
    var query = {};
    query.worker_type = req.body.worker_type;
    Person.update(conditions, query, function(err,person){
      if(err)
        res.send(err);
      res.send({status: true});
    });
  });
};

exports.create =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var currentTime = Date.now();
    new Person({
      id_airport: airport.id_airport,
      id_person: req.body.id_person,
      worker_name: req.body.worker_name,
      worker_type: req.body.worker_type,
      worker_device: req.body.worker_device,
      created_at: currentTime
    }).save( function( err ){
      if(err)
        res.send(err);
      else{
        var hashKey = hashCalculate(airport.id_airport,req.body.id_person,req.body.worker_name,currentTime);
        new HashRegistration({
          id_airport: airport.id_airport,
          id_person: req.body.id_person,
          worker_name: req.body.worker_name,
          hash: hashKey.toString(),
          update_at: Date.now()
        }).save(function(err){
          if(err)
            res.send(err);
          res.send({status: true});
        })
      }
    });
  });
};

exports.hash =  function(req, res){
  HashRegistration.findOne({hash: req.body.hash}).exec(function(err, hash){
    if(err)
      res.send({status:false});
    else if(hash != null){
      var currentTime = Date.now();
      var conditions = {id_airport: hash.id_airport, id_person: hash.id_person};
      var query = {};
      query.hash = hashCalculate(hash.id_airport, hash.id_person, hash.worker_name, currentTime);
      query.update_at = currentTime;
      HashRegistration.update(conditions, query, function(err,newhash){
        if(err)
          res.send({status:false});
        res.send({
          id_airport: hash.id_airport,
          id_person: hash.id_person,
          worker_name: hash.worker_name,
          hash: hash.hash
        });
      });
    }
    else{
      res.send({status:false});
    }
  });
};

exports.delete =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Person.remove({id_airport: airport.id_airport, id_person: req.body.id_person}, function(){
      if(err)
        res.send(err);
      res.send({status: true});
    });
  });
};