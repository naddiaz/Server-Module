var Mongoose = require( 'mongoose' );
var Administrator = Mongoose.model( 'Administrator' );

exports.home =  function(req, res){
  res.render('login',{});
};

exports.register = function(req, res){
  var admin = new Administrator({
    id_admin: req.body.id_admin,
    name: req.body.name,
    password: req.body.password,
    created_at: Date.now(),
    last_login: Date.now()
  });
  admin.save(function(err){
    if(!err)
      res.send({status: true});
    res.send({status:false});
  });
}