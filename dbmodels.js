var Mongoose = require( 'mongoose' );
var Schema   = Mongoose.Schema;

var Person = new Schema({
  id_person: {type: Number, unique: true},
  id_push: Number,
  worker_name: String,
  worker_id: {type: Number, unique: true},
  worker_type: String,
  device_type: {type: String, default: 'android'}
});


var db = Mongoose.connect('mongodb://localhost/bletaskerDB');
db.model('Person', Person);