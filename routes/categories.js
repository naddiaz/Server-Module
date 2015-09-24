var Mongoose = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Category     = Mongoose.model( 'Category' );

exports.home =  function(req, res){
  var id_installation = req.params.id_installation;
  res.render('categories',{
    id_installation: id_installation,
    admin : {
      name: req.query.name,
      id: req.query.id
    }
  });
};

exports.save =  function(req, res){
  new Category({
    id_installation: req.body.id_installation,
    name: req.body.name
  }).save( function(err){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};

exports.delete =  function(req, res){
  Category.remove({
    id_installation: req.body.id_installation,
    name: req.body.name
  }, function(err){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};

exports.categoriesList =  function(req, res){
  Category.find({
    id_installation: req.body.id_installation
  }, {}, { sort: { 'created_at' : -1 } }, function(err, categories) {
    res.send({
      categories: categories
    });
  });
};

exports.updateCategory =  function(req, res){
  var conditions = {id_installation: req.body.id_installation, name: req.body.old_name};
  var query = {name: req.body.new_name};
  Category.update(conditions, query, function(err){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};