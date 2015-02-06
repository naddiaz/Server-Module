var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Person = new Schema({
  id_person: String,
  id_push: String,
  worker_name: String,
  worker_id: Number,
  worker_type: String
});