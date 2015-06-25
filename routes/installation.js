
var Mongoose = require( 'mongoose' );
var Installation     = Mongoose.model( 'Installation' );

exports.index =  function(req, res){
  Installation.find({}).exec(function(err,installations){
    res.render('index',{
      installations: installations
    });
  });
};


// helpers: AJAX
exports.getInstallationById = function(req,res){
  Installation.findOne({id_installation:req.body.id_installation},{}, { sort: { 'id_installation' : 1 }}).exec(function(err,installation){
    res.send({
      installation: installation
    });
  });
}