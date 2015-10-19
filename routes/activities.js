
var Mongoose     = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Employee     = Mongoose.model( 'Employee' );
var Activity     = Mongoose.model( 'Activity' );
var Task         = Mongoose.model( 'Task' );
var Beacon       = Mongoose.model( 'Beacon' );
var Async        = require( 'async' );
var SuitableSet  = require( './location/suitableSet' );

exports.home =  function(req, res){
  var id_installation = req.params.id_installation;
  res.render('activities',{
    id_installation: id_installation,
    admin : {
      name: req.query.name,
      id: req.query.id
    }
  });
};

exports.create =  function(req, res){
  var activity = createActivity(req);
  var employees = req.body.employees;
  if(employees.length > 0){
    activity.save(function(err,activity){
      if(!err){
        var taskList = []
        for(var i=0; i<employees.length; i++){
          var task = new Task({
            id_task: employees[i] + "-" + activity.id_activity,
            state: 1,
            time: activity.time,
            track: [{
              state: 1,
              update_at: Date.now()
            }],
            id_employee: employees[i],
            id_activity: activity.id_activity,
            id_installation: activity.id_installation,
            created_at: Date.now(),
            update_at: Date.now()
          });
          taskList.push(task);
          task.save();
          updateEmployee(activity.id_installation, employees[i]);
        }
        res.send({activity:activity,task:taskList});
      }
    });
  }
};

exports.createAuto =  function(req, res){
  var activity = createActivity(req);
  activity.save(function(err,activity){
    if(!err){
      var date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);

      var Beacons = Beacon.find({id_installation:req.body.id_installation, "group.id": req.body.cluster}).select("location");
      var Employees = Employee.find({id_installation:req.body.id_installation},{ track: { $slice: -1 }});
      var Tasks     = Task.find({id_installation:req.body.id_installation, created_at: {$gte: date}});

      var models = {
        employees: Employees.exec.bind(Employees),
        tasks: Tasks.exec.bind(Tasks),
        beacons: Beacons.exec.bind(Beacons)
      };

      Async.parallel(models,function(err,results){
        var employees = SuitableSet(req.body.required,results.beacons,results.employees,activity,results.tasks)
        var taskList = []
        for(var i=0; i<employees.length; i++){
          var task = new Task({
            id_task: employees[i].id_employee + "-" + activity.id_activity,
            state: 1,
            time: activity.time,
            track: [{
              state: 1,
              update_at: Date.now()
            }],
            id_employee: employees[i].id_employee,
            id_activity: activity.id_activity,
            id_installation: activity.id_installation,
            created_at: Date.now(),
            update_at: Date.now()
          });
          taskList.push(task);
          task.save();
          updateEmployee(activity.id_installation, employees[i].id_employee);
        }
        res.send({activity:activity,task:taskList});
      });
    }
  });
};

function createActivity(req){
  var current = Date.now();
  var date = new Date(current);
  var time = parseInt(req.body.hour)*60+parseInt(req.body.minutes);
  var id = req.body.category.substring(0,3).toUpperCase();
  id += (req.body.required < 10) ? '0'+req.body.required : req.body.required;
  id += req.body.priority;
  id += (date.getHours() < 10) ? '0'+date.getHours() : date.getHours();
  id += (date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes();
  if(time< 10)
    id += '00'+time;
  else if(time < 100)
    id += '0'+time;
  else
    id += time;
  var activity = new Activity({
    id_installation: req.body.id_installation,
    id_activity: id,
    location: {
      latitude: req.body.location.latitude,
      longitude: req.body.location.longitude
    },
    cluster: req.body.cluster,
    category: req.body.category,
    priority: req.body.priority,
    required: req.body.required,
    time: time,
    description: req.body.description,
    created_at: current,
    update_at: current
  });
  return activity;
}

function updateEmployee(id_installation,id_employee){
  var current = new Date().getTime();
  var conditions = {id_installation: id_installation, id_employee: id_employee};
  var query = {sync_tasks: current};
  Employee.update(conditions, query, function(err){
    if(err)
      console.log(err);
  });
}
