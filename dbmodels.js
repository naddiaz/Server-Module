var Mongoose = require( 'mongoose' );
var Schema   = Mongoose.Schema;

var Airport = new Schema({
  id_airport: Number,
  latitude: Number,
  longitude: Number,
  location: String,
  name: String
});
Airport.index({id_airport: 1, location: 1, name: 1}, {unique: true});

var Cell = new Schema({
  id_airport: Number,
  id_cell: Number,
  latitude: Number,
  longitude: Number,
  color: String
});
Cell.index({id_airport: 1, id_cell: 1}, {unique: true});

var Distance = new Schema({
  id_airport: Number,
  cell_origin: Number,
  cell_end: Number,
  distance: Number
});
Distance.index({id_airport: 1, cell_origin: 1, cell_end: 1}, {unique: true});

var Cell = new Schema({
  id_airport: Number,
  id_cell: Number,
  latitude: Number,
  longitude: Number,
  color: String
});
Cell.index({id_airport: 1, id_cell: 1}, {unique: true});

var Person = new Schema({
  id_airport: Number,
  id_person: Number,
  id_push: Number,
  worker_name: String,
  worker_id: Number,
  worker_type: String,
  device_type: {type: String, default: 'ANDROID'}
});
Person.index({id_airport: 1, id_person: 1}, {unique: true});

var Localization = new Schema({
  id_airport: Number,
  id_person: Number,
  id_beacon: Number,
  date: Date
});

var Beacon = new Schema({
  id_airport: Number,
  id_beacon: Number,
  id_cell: String
});
Beacon.index({id_airport: 1, id_beacon: 1}, {unique: true});

var Task = new Schema({
  id_airport: Number,
  id_task: Number,
  id_cell: String,
  type: String,
  priority: {type: Number, enum: [0,1,2,3,4]},
  description: String
});
Task.index({id_airport: 1, id_task: 1}, {unique: true});

var Type = new Schema({
  id_airport: Number,
  name: String
});
Type.index({id_airport: 1, name: 1}, {unique: true});

var Work = new Schema({
  id_airport: Number,
  id_person: Number,
  id_task: Number,
  state: {type: String, enum: ["no_asign", "asign", "running", "finish", "pause", "cancel"]},
  created_at: Date,
  asign_at: Date,
  running_at: Date,
  finish_at: Date,
  pause_at: Date,
  cancel_at: Date,
  person: { type: Schema.ObjectId, ref: 'Person' },
  task: { type: Schema.ObjectId, ref: 'Task' }
});

var TestBeacons = new Schema({
  id_beacon: String,
  mac: String,
  timestamp: String,
  rssi: String,
  avg_rssi: String,
  distance: String
});

var db = Mongoose.connect('mongodb://localhost/bletaskerDB');
db.model('Airport', Airport);
db.model('Person', Person);
db.model('Localization', Localization);
db.model('Beacon', Beacon);
db.model('Task', Task);
db.model('Work', Work);
db.model('Cell', Cell);
db.model('Distance', Distance);
db.model('Type', Type);
db.model('TestBeacons', TestBeacons);
