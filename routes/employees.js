async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');
var Type = Mongoose.model('Type');
var HashRegistration = Mongoose.model('HashRegistration');

RSACrypt = require('./RSACrypt.js');
Token = require('./Token.js');

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

function hashCalculate(id_airport,id_person,name,date){
  var input = id_airport + id_person + worker_name + date.toString();
  var a =  Math.floor(Math.random() * (13421772 - 0) + 0);
  var b =  Math.floor(Math.random() * (13421772 - a) + a);
  for(var i = 0; i<input.length; i++){
    a = a ^ input.charCodeAt(i);
    b = b ^ a ^ 55;
  }
  return (a.toString(16) + b.toString(16));
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

exports.hashCheck =  function(req, res){
  var data =  RSACrypt.decrypt(req.body.data);
  HashRegistration.findOne({hash: data}).exec(function(err, hash){
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
        else{
	  var json = {
            id_airport: hash.id_airport,
            id_person: hash.id_person,
            worker_name: hash.worker_name,
            hash: query.hash
          };
	  var response = RSACrypt.encrypt(JSON.stringify(json),hash.id_airport,hash.id_person);
	  res.send({response:response});
	}
      });
    }
    else{
      res.send({status:false});
    }
  });
};

exports.hashVerify =  function(req, res){
  var data =  RSACrypt.decrypt(req.body.data);
  HashRegistration.findOne({hash: data}).exec(function(err, hash){
    if(err)
      res.send({status:false});
    else if(hash == null)
      res.send({status:false});
    else
      res.send({status:true});
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


exports.tasks =  function(req, res){
  var data =  RSACrypt.decrypt(req.body.data);
  var token = RSACrypt.decrypt(req.body.token);
  HashRegistration.findOne({hash:data}).exec(function(err, hash){
    if(err)
      res.send({status:false});
    else if(hash == null)
      res.send({status:false});
    else{
      Work.find({id_airport: hash.id_airport, id_person: hash.id_person}).populate('person task').exec(function(err,works){
        var works_active = new Array();
        var works_pending = new Array();
        var works_complete = new Array();
        var works_pause = new Array();
        var works_stop = new Array();
        for(var j=0; j<works.length; j++){
          if(works[j].state.toString() == 'complete')
            works_complete.push(worksData(works[j]));
          else if(works[j].state.toString() == 'active')
            works_active.push(worksData(works[j]));
          else if(works[j].state.toString() == 'asign')
            works_pending.push(worksData(works[j]));
          else if(works[j].state.toString() == 'cancel')
            works_stop.push(worksData(works[j]));
          else if(works[j].state.toString() == 'pause')
            works_pause.push(worksData(works[j]));
        }
        if(err)
          res.send({status:false});
        var json = {
          works_complete: works_complete,
          works_active: works_active,
          works_pending: works_pending,
          works_pause: works_pause,
          works_stop: works_stop
        };
	var jsonText = JSON.stringify(json);
	var tokenServer = Token.generate(jsonText);
        if(tokenServer == token){
          res.send({status:true});
        }
	else{
          res.send({
	    response:RSACrypt.encrypt(jsonText,hash.id_airport,hash.id_person),
	    token:RSACrypt.encrypt(tokenServer,hash.id_airport,hash.id_person)
          });
	}
      });
    }
  });
};

exports.taskState =  function(req, res){
  HashRegistration.findOne({hash:req.body.hash}).exec(function(err, hash){
    if(err)
      res.send({status:false});
    else if(hash == null)
      res.send({status:false});
    else{
      var conditions = {id_airport: hash.id_airport, id_person: hash.id_person, id_task: req.body.id_task};
      var query = {};
      query.state = req.body.state;

      switch (query.state){
        case "active":
          query.active_at = Date.now();
          break;
        case "complete":
          query.complete_at = Date.now();
          break;
        case "pause":
          query.pause_at = Date.now();
          break;
        case "cancel":
          query.cancel_at = Date.now();
          break;
        default:
          res.send({status:false});
          break;
      }
      Work.update(conditions, query, function(err,work){
        if(err)
          res.send(err);
        res.send({status: true});
      });
    }
  });
};

function worksData(work){
  return {
    id_task: work.id_task,
    description: work.task.description,
    priority: work.task.priority,
    n_employees: work.task.n_employees,
    created_at: work.created_at
  }
}
