var Mongoose = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Location     = Mongoose.model( 'Location' );

exports.send =  function(req, res){
  var location = new Location({
    id_installation: req.body.id_installation,
    id_employee: req.body.id_employee,
    //Temporal
    beacons:[
      //{id: '11:11:11:11:11:11',powerDbm:-91},
      //{id: '22:22:22:22:22:22',powerDbm:-83},
      {id: '33:33:33:33:33:33',powerDbm:-86},
      {id: '44:44:44:44:44:44',powerDbm:-79},
      {id: '55:55:55:55:55:55',powerDbm:-71}
    ],
    detected_at: Date.now()
  });
  location.save(function(err){
    if(err)
      res.send({status:err});
    res.send({status:true});
  })
}