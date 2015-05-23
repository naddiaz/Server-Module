RSACrypt = require('./RSACrypt.js');
gcm = require('node-gcm');

var Mongoose = require( 'mongoose' );
var GCM     = Mongoose.model( 'GCMRegistrationID' );
var Parameter     = Mongoose.model( 'Parameter' );

exports.index =  function(req, res){
  var encodeMessage = RSACrypt.encrypt(req.body.message,req.body.id_airport,req.body.id_person);
  var signMessage = RSACrypt.sign(req.body.message,req.body.id_airport,req.body.id_person);

  var Parameters = Parameter.findOne({name: "api_key"});
  var GCMs = GCM.findOne({id_airport: req.body.id_airport, id_person: req.body.id_person});

  var data = {
    parameters: Parameters.exec.bind(Parameters),
    gcms: GCMs.exec.bind(GCMs)
  };
  async.parallel(data,function(err,results){
    if(err)
      res.send({status: err});
    else if(results.gcms != null){
      var message = new gcm.Message();
      message.addData({
        sign: signMessage,
        message: encodeMessage
      })
      message.collapseKey = 'taskPush';

      var sender = new gcm.Sender(results.parameters.value);

      var regIds = [];
      regIds.push(results.gcms.id_push);

      sender.send(message, regIds, function(err, data) {
        if(err){
          res.send(err);
        }
        res.send({sign: signMessage, message: encodeMessage});
      });
    }
  });
};