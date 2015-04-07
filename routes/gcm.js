async = require("async");
gcm = require('node-gcm');

var Mongoose = require( 'mongoose' );
var GCM     = Mongoose.model( 'GCMRegistrationID' );
var Parameter     = Mongoose.model( 'Parameter' );

exports.registrationGCM =  function(req, res){
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
};

exports.sendNotificationTest =  function(req, res){
  var message = new gcm.Message();
  message.addData('BLE Tasker','TEST!');

  var Parameters = Parameter.findOne({name: "api_key"});
  var GCMs = GCM.find({});

  var data = {
    parameters: Parameter.exec.bind(Parameters),
    gcms: GCMs.exec.bind(GCMs)
  };
  async.parallel(data,function(err,results){
    if(err)
      res.send({status: err});
    else{
      var sender = new gcm.Sender(results.parameters.value);
      var regIds = [];
      for(reg in results.gcms){
        regIds.push(reg.id_push);
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