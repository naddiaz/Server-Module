var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );

exports.create = function(req, res){
  new Person({
    id_person: 0,
    id_push: 1000,
    worker_name: "NESTOR",
    worker_id: 0,
    worker_type: "ADMIN"
  }).save( function( err, todo, count ){
    res.redirect( '/people/list' );
  });
};

exports.list = function(req, res){
  Person.find( function(err, people){
    res.render('people',{
      title: 'People List',
      people: people
    });
  });
};