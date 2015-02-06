var Mongoose = require( 'mongoose' );
var Schema   = Mongoose.Schema;

var Person = new Schema({
  id_person: Number,
  id_push: Number,
  worker_name: String,
  worker_id: Number,
  worker_type: String,
  device_type: {type: String, default: 'android'}
});


var db = Mongoose.connect('mongodb://localhost/bletaskerDB');
db.model('Person', Person);