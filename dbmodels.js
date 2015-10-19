var Config = require('./configuration.js')
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

var Administrator = new Schema({
  id_admin: String,
  name: String,
  password: String,
  created_at: Date,
  last_login: Date
});
Administrator.index({id_admin:1},{unique: true});

var Employee = new Schema({
  id_installation: String,
  id_employee: String,
  name: String,
  last_name: String,
  category: String,
  device: {type: String, default: 'ANDROID'},
  gcm: String,
  hash: String,
  created_at: Date,
  update_at: Date,
  track: [{
    location: {
      latitude: Number,
      longitude: Number
    },
    register_at: Date
  }],
  sync_tasks: Number
});
Employee.index({id_employee: 1, id_installation: 1},{unique: true});

var Activity = new Schema({
  id_installation: String,
  id_activity: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  cluster: Number,
  category: String,
  priority: Number,
  required: Number,
  time:Number,
  description: String,
  created_at: Date,
  update_at: Date
});
Activity.plugin(Tree);
Activity.index({id_activity: 1, id_installation: 1},{unique: true});

var Task = new Schema({
  id_task: String,
  state: String,
  time:Number,
  track: [{
    state: Number,
    update_at: Date
  }],
  id_employee: String,
  id_activity: String,
  id_installation: String,
  created_at: Date,
  update_at: Date
});
Task.plugin(Tree);
Task.index({id_task: 1, id_employee: 1, id_activity: 1, id_installation: 1},{unique: true});

var Message = new Schema({
  id_installation: String,
  id_admin: String,
  id_employee: String,
  from: Number,
  text: String,
  created_at: Date
});

var Beacon = new Schema({
  id_installation: String,
  id_beacon: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  group: {
    id: Number,
    color: String
  },
  adjacent: [{
    id_beacon: String,
    distance: Number
  }]
});
Beacon.plugin(Tree);
Beacon.index({id_beacon: 1, id_installation: 1},{unique: true});

var Location = new Schema({
  id_installation: String,
  id_employee: String,
  beacons: [{
    id: String,
    powerDbm: Number
  }],
  detected_at: Date
});
Location.plugin(Tree);

var Parameter = new Schema({
  name: String,
  value: String
})
Parameter.index({name: 1},{unique: true});

var db = Mongoose.connect('mongodb://'+Config.getUser()+':'+Config.getPassword()+'@ds041581.mongolab.com:41581/bletasker');
//var db = Mongoose.connect('mongodb://localhost/bletasker');

db.model('Installation',      Installation);
db.model('Category',          Category);
db.model('Administrator',     Administrator);
db.model('Employee',          Employee);
db.model('Activity',          Activity);
db.model('Task',              Task);
db.model('Message',           Message);
db.model('Beacon',            Beacon);
db.model('Location',          Location);
db.model('Parameter',         Parameter);
