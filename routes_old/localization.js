var Mongoose = require( 'mongoose' );
var Localization     = Mongoose.model( 'Localization' );
var Airport     = Mongoose.model( 'Airport' );

exports.read_localization =  function(req, res){
  Localization.find(function(err, localization){
    res.render('localization',{title: 'BLE Tasker', localization: localization, layout: 'layout_admin'});
  });
};

exports.create_localization =  function(req, res){
  console.log(req.body)
  new Localization({
    id_airport: req.body.id_airport,
    id_person: req.body.id_person,
    id_beacon: req.body.id_beacon,
    date: Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/admin/config/localization' );
  });
};

exports.get_employees_by_cell =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var rules = [
      {id_airport: airport.id_airport},
      {id_beacon: parseInt(req.body.id_cell)},
      {id_person: {$nin: JSON.parse(req.body.ids_people)}},
      {date: {$gte: new Date(req.body.last_minute)}}
    ]
    Localization.aggregate([
      {$match:
        {
          $and: rules
        }
      },
      {
        $sort:
          {
            date: -1
          }
      },
      {
        $group:
          {
            _id: {id_person : "$id_person"},
            lastSalesDate: { $last: "$date" }
          }
      }
    ], function(err, people){
      res.send(people)
    });
  });
}