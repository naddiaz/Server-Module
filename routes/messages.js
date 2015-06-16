async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Airport     = Mongoose.model( 'Airport' );
var Message     = Mongoose.model( 'Message' );
var HashRegistration = Mongoose.model('HashRegistration');

exports.send_server = function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    new Message({
      id_airport: airport.id_airport,
      id_person: req.body.id_person,
      origin: req.body.origin,
      content: req.body.content,
      send_at: Date.now()
    }).save( function( err ){
      if(err)
        res.send(err);
      else{
      	res.send({status:true});
      }
  	});
  });
};

exports.update_server = function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    if(req.body.last_message != 0){
      Message.find({id_airport: airport.id_airport, id_person: req.body.id_person,send_at: {$gt: req.body.last_message}}).exec(function(err, messages){
        res.send({messages:messages});
      });
    }
    else{
      Message.find({id_airport: airport.id_airport, id_person: req.body.id_person}).exec(function(err, messages){
  			if(err)
  				res.send(err);
  			else{
        	res.send({messages:messages});
  	    }
  		});
    }
  });
};

exports.send_device = function(req, res){
  var data =  RSACrypt.decrypt(req.body.data);
  var content = RSACrypt.decrypt(req.body.content);
  HashRegistration.findOne({hash:data}).exec(function(err, hash){
    new Message({
      id_airport: hash.id_airport,
      id_person: hash.id_person,
      origin: 'device',
      content: content,
      send_at: Date.now()
    }).save( function( err ){
      if(err)
        res.send(err);
      else{
        res.send({status:true});
      }
    });
  });
};

exports.update_device = function(req, res){
  var data =  RSACrypt.decrypt(req.body.data);
  HashRegistration.findOne({hash:data}).exec(function(err, hash){
    Message.find({id_airport: hash.id_airport, id_person: hash.id_person}).exec(function(err, messages){
      if(err)
        res.send(err);
      else{
        var jsonText = JSON.stringify({messages:messages});
        res.send({
          response:RSACrypt.encrypt(jsonText,hash.id_airport,hash.id_person)
        });
      }
    });
  });
};