var Mongoose = require( 'mongoose' );
var Localization     = Mongoose.model( 'Localization' );

exports.read_localization =  function(req, res){
  Localization.find(function(err, localization){
    res.render('localization',{title: 'BLE Tasker', localization: localization, layout: 'layout_admin'});
  });
};

exports.create_localization =  function(req, res){
  console.log(req.body)
  new Localization({
    id_person: req.body.id_person,
    id_beacon: req.body.id_beacon,
    date: Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/admin/config/localization' );
  });
};
