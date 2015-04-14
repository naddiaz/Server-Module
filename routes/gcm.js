async = require("async");
gcm = require('node-gcm');

var Mongoose = require( 'mongoose' );
var GCM     = Mongoose.model( 'GCMRegistrationID' );
var Parameter     = Mongoose.model( 'Parameter' );
var Airport     = Mongoose.model( 'Airport' );
var Task     = Mongoose.model( 'Task' );

exports.registrationGCM =  function(req, res){
  GCM.findOne({id_airport: req.body.id_airport, id_person: req.body.id_person}).exec(function(err,gcm){
    if(err)
      res.send({status:false});
    else if(gcm == null){
      new GCM({
        id_airport: req.body.id_airport,
        id_person: req.body.id_person,
        id_push: req.body.id_push,
        created_at: Date.now()
      }).save( function( err, gcm ){
        console.log("=== GCM ===");
        console.log(gcm);
        if(err)
          res.send(err);
        res.send({status: true});
      });
    }
    else{
      var conditions = {id_airport: req.body.id_airport, id_person: req.body.id_person};
      var query = {};
      query.id_push = req.body.id_push;
      GCM.update(conditions, query, function(err,gcm){
        if(err)
          res.send(err);
        res.send({status: true});
      });
    }
  });
};

exports.unlinkGCM =  function(req, res){
  GCM.findOneAndRemove({id_airport: req.body.id_airport, id_person: req.body.id_person}).exec(function(err,gcm){
    if(err)
      res.send({status:false});
    res.send({status:true});
  });
};

exports.create =  function(req, res){

  var Parameters = Parameter.findOne({name: "api_key"});
  var GCMs = GCM.findOne({id_airport: req.body.id_airport, id_person: req.body.id_person});
  var Tasks = Task.findOne({id_airport: req.body.id_airport,id_task: req.body.id_task});

  var data = {
    parameters: Parameters.exec.bind(Parameters),
    gcms: GCMs.exec.bind(GCMs),
    tasks: Tasks.exec.bind(Tasks)
  };
  async.parallel(data,function(err,results){
    if(err)
      res.send({status: err});
    else if(results.gcms != null){
      var message = new gcm.Message();
      message.addData({
        id_task: results.tasks.id_task,
        description: results.tasks.description
      })

      var sender = new gcm.Sender(results.parameters.value);

      var regIds = [];
      regIds.push(results.gcms.id_push);

      sender.send(message, regIds, function(err, data) {
        if(err){
          res.send(err);
        }
        res.send({status: true});
      });
    }
  });
};

exports.sendNotificationTest =  function(req, res){
  var message = new gcm.Message();
  message.addData('BLE Tasker','TEST!');

  var Parameters = Parameter.findOne({name: "api_key"});
  var GCMs = GCM.find({});

  var data = {
    parameters: Parameters.exec.bind(Parameters),
    gcms: GCMs.exec.bind(GCMs)
  };
  async.parallel(data,function(err,results){
    if(err)
      res.send({status: err});
    else{
      var sender = new gcm.Sender(results.parameters.value);
      var regIds = [];
      for(i in results.gcms){
        regIds.push(results.gcms[i].id_push);
      }
      sender.send(message, regIds, function (err, result) {
        if(err){
          res.send(err);
        }
        res.send({status: true});
      });
    }
  });

};
