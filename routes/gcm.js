async = require("async");
gcm = require('node-gcm');

var Mongoose = require( 'mongoose' );
var GCM     = Mongoose.model( 'GCMRegistrationID' );

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
  var regIds = ["APA91bF_HduSEIBrH0YG3hQQVT9zpa_G7bcOLTeQTpECt5mQvgV1OXLk7VdhN3Uqoj0s139bS8GuYTVrECG_rCrr3oTckg5fenbXcpnVQYj1XPZ-zDdVT_-q2ox3IzUksG-nKkc51hZEqO0yoR98viMNXZMR_meAWA"];
  var sender = new gcm.Sender("AIzaSyAra20M9PTtUj1QXoCaTq-FrzVRsdl4SlA");
  sender.send(message, regIds, function (err, result) {
    if(err){
      console.log(err);
      res.send(err);
    }
    console.log(result);
    res.send({status: true});
  });
};