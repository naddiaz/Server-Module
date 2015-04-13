async = require("async");
gcm = require('node-gcm');

var Mongoose = require( 'mongoose' );
var GCM     = Mongoose.model( 'GCMRegistrationID' );
var Parameter     = Mongoose.model( 'Parameter' );
var Airport     = Mongoose.model( 'Airport' );

exports.registrationGCM =  function(req, res){
  GCM.find({id_airport: airport.id_airport, id_person: req.body.id_person}).exec(function(err,gcm){
    if(err)
      res.send({status:false});
    else if(gcm == null)
      res.send({status:false});
    else{
      new GCM({
        id_airport: req.body.id_airport,
        id_person: req.body.id_person,
        id_push: req.body.id_push,
        created_at: Date.now()
      }).save( function( err ){
        if(err)
          res.send(err);
        res.send({status: true});
      });
    }
  });
};

exports.create =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){

    var message = new gcm.Message();
    message.addData('title',req.body.id_task);
    message.addData('description',req.body.description);

    var Parameters = Parameter.findOne({name: "api_key"});
    var GCMs = GCM.find({id_airport: airport.id_airport, id_person: req.body.id_person});

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
            console.log(err);
            res.send(err);
          }
          res.send({status: true});
        });
      }
    });
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
          console.log(err);
          res.send(err);
        }
        console.log(result);
        res.send({status: true});
      });
    }
  });

};
