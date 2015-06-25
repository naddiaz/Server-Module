var Mongoose = require( 'mongoose' );
var Tree = require('mongoose-tree');
var Schema   = Mongoose.Schema;

var Installation = new Schema({
  id_installation: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  name: String,
  details: String
});
Installation.plugin(Tree);
Installation.index({id_installation: 1},{unique: true});

var Category = new Schema({
  id_installation: String,
  name: String
});
Category.index({id_installation: 1, name: 1},{unique: true});

var Employee = new Schema({
  id_employee: String,
  name: String,
  last_name: String,
  category: String,
  device: {type: String, default: 'ANDROID'},
  gcm: String,
  hash: String,
  created_at: Date,
  update_at: Date,
  installation: {type: Schema.ObjectId, ref: 'Installation'}
});
Employee.index({id_employee: 1},{unique: true});

var Activity = new Schema({
  id_activity: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  category: String,
  tasks: Number,
  details: String,
  created_at: Date,
  update_at: Date,
  installation: {type: Schema.ObjectId, ref: 'Installation'}
});
Activity.plugin(Tree);
Activity.index({id_activity: 1},{unique: true});

var Task = new Schema({
  id_task: String,
  state: String,
  track: [{
    state: String,
    update_at: Date
  }],
  employee: {type: Schema.ObjectId, ref: 'Employee'},
  activity: {type: Schema.ObjectId, ref: 'Activity'}
});
Task.plugin(Tree);
Task.index({id_task: 1},{unique: true});

var Beacon = new Schema({
  id_beacon: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  view: {
    color: String
  },
  installation: {type: Schema.ObjectId, ref: 'Installation'}
});
Beacon.plugin(Tree);
Beacon.index({id_beacon: 1},{unique: true});

var Adjacent = new Schema({
  id_adjacent: String,
  distance: Number,
  beacon: {type: Schema.ObjectId, ref: 'Beacon'}
});
Adjacent.index({id_adjacent: 1, beacon: 1},{unique: true});

var Location = new Schema({
  id_installation: String,
  id_employee: String,
  id_beacon: String,
  data: {
    powerDbm: Number,
    detected_at: Date 
  }
});
Location.plugin(Tree);

var Parameter = new Schema({
  name: String,
  value: String
})
Parameter.index({name: 1},{unique: true});

var db = Mongoose.connect('mongodb://localhost/bletasker');

db.model('Installation', Installation);
db.model('Category',     Category);
db.model('Employee',     Employee);
db.model('Activity',     Activity);
db.model('Task',         Task);
db.model('Beacon',       Beacon);
db.model('Adjacent',     Adjacent);
db.model('Location',     Location);
db.model('Parameter',    Parameter);
