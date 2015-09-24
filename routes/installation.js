
var Mongoose = require( 'mongoose' );
var Installation  = Mongoose.model( 'Installation' );
var Beacon        = Mongoose.model( 'Beacon' );
var Administrator = Mongoose.model( 'Administrator' );

exports.indexGet =  function(req, res){
  Installation.find({}).exec(function(err,installations){
    res.render('index',{
      admin : {
        name: req.query.name,
        id: req.query.id
      },
      installations: installations
    });
  });
};

exports.index =  function(req, res){
  if(req.body.user != ""){
    Administrator.findOne({id_admin: req.body.user}).exec(function(err,admin){
      if(!err){
        if(admin.password == req.body.pass){
          Installation.find({}).exec(function(err,installations){
            res.render('index',{
              admin : {
                name: admin.name,
                id: admin.id_admin
              },
              installations: installations
            });
          });
        }
      }
    });
  }
  else{
    res.render('login',{});
  }
};


// helpers: AJAX
exports.getInstallationById = function(req,res){
  Installation.findOne({id_installation:req.body.id_installation},{}, { sort: { 'id_installation' : -1 }}).exec(function(err,installation){
    res.send({
      installation: installation
    });
  });
}
