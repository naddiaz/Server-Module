var Mongoose = require( 'mongoose' );
var Administrator = Mongoose.model( 'Administrator' );
var Employee     = Mongoose.model( 'Employee' );
var Message      = Mongoose.model( 'Message' );

exports.send =  function(req, res){
  new Message({
    id_installation: req.body.id_installation,
    id_admin: req.body.id_admin,
    id_employee: req.body.id_employee,
    from: req.body.from,
    text: req.body.text,
    created_at: Date.now()
  }).save(function(err){
    if(!err)
      res.send({status: true});
    res.send({status: false});
  })
}

exports.update =  function(req, res){
  var date = new Date(req.body.last);
  date.setSeconds(date.getSeconds()+1);
  Message.find({
    id_installation: req.body.id_installation,
    id_admin: req.body.id_admin,
    id_employee: req.body.id_employee,
    created_at: {$gt: date}
  })
  .sort({'created_at': 1}).select('text from created_at')
  .exec(function(err,messages){
    if(!err)
      res.send({messages: messages})
    res.send({messages: false})
  });
}

exports.clear =  function(req, res){
  Message.find({
    id_installation: req.body.id_installation,
    id_admin: req.body.id_admin,
    id_employee: req.body.id_employee
  })
  .remove(function(err,messages){
    if(!err)
      res.send({status: true})
    res.send({status: false})
  });
}