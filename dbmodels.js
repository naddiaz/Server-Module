var Mongoose = require( 'mongoose' );
var Schema   = Mongoose.Schema;

var Airport = new Schema({
  id_airport: {type: Number, unique: true},
  location: String,
  name: String
});

var Person = new Schema({
  id_airport: Number,
  id_person: Number,
  id_push: Number,
  worker_name: String,
  worker_id: Number,
  worker_type: String,
  device_type: {type: String, default: 'android'}
});
Person.index({id_airport: 1, id_person: 1}, {unique: true});

var Localization = new Schema({
  id_person: Number,
  id_beacon: Number,
  date: Date
});

var Beacon = new Schema({
  id_airport: Number,
  id_beacon: Number,
  id_cell: String
});

var Task = new Schema({
  id_task: {type: Number, unique: true},
  id_beacon: Number,
  type: String,
  priority: {type: Number, enum: [0,1,2,3,4]},
  description: String
});

var Work = new Schema({
  id_person: Number,
  id_task: Number,
  state: {type: String, enum: ["no_asign", "asign", "running", "finish", "pause", "cancel"]},
  date: [{
    created_at: Date,
    asign_at: Date,
    running_at: Date,
    finish_at: Date,
    pause_at: Date,
    cancel_at: Date
  }]
});

var db = Mongoose.connect('mongodb://localhost/bletaskerDB');
db.model('Airport', Airport);
db.model('Person', Person);
db.model('Localization', Localization);
db.model('Beacon', Beacon);
db.model('Task', Task);
db.model('Work', Work);