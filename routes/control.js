var Async        = require( 'async' );
var Mongoose     = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Activity     = Mongoose.model( 'Activity' );
var Employee     = Mongoose.model( 'Employee' );
var Task         = Mongoose.model( 'Task' );
var Beacon       = Mongoose.model( 'Beacon' );

exports.home =  function(req, res){
  var id_installation = req.params.id_installation;

  res.render('control',{
    id_installation: id_installation,
    admin : {
      name: req.query.name,
      id: req.query.id
    }
  });
};

exports.getActivitiesStates =  function(req, res){
  Activity.find({id_installation:req.body.id_installation}).exec(function(err,activities){

  });
};

exports.employeesStates =  function(req, res){
  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  var Employees = Employee.find({id_installation:req.body.id_installation}).sort({'created_at': 1}).select('id_employee name category');
  var Tasks     = Task.find({id_installation:req.body.id_installation, created_at: {$gte: date}});

  var models = {
    employees: Employees.exec.bind(Employees),
    tasks: Tasks.exec.bind(Tasks)
  };

  Async.parallel(models,function(err,results){
    var data = [];
    for(var i=0; i<results.employees.length; i++){
      var tasks = [];
      for(var j=0; j<results.tasks.length; j++){
        if(results.employees[i].id_employee == results.tasks[j].id_employee){
          tasks.push(results.tasks[j]);
        }
      }
      data.push({data:results.employees[i],tasks:tasks});
    }
    res.send({
      employees: data
    })
  });
};

exports.tasksStates =  function(req, res){
  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  Task.find({
    id_installation:req.body.id_installation,
    state: req.body.state,
    created_at: {$gte: date}
  })
  .sort({'created_at': 1})
  .select('id_task time id_employee created_at')
  .exec(function(err,tasks){
    if(err)
      res.send({status:false});
    res.send({tasks: tasks});
  });
};

exports.noAssignedActivities =  function(req, res){
  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  var Tasks = Task.find({
    id_installation:req.body.id_installation,
    created_at: {$gte: date}
  });
  var Activities = Activity.find({
    id_installation:req.body.id_installation,
    created_at: {$gte: date}
  });

  var models = {
    tasks: Tasks.exec.bind(Tasks),
    activities: Activities.exec.bind(Activities)
  };

  Async.parallel(models,function(err,results){
    if(err)
      res.send({status:false});
    var noAssigned = [];
    for(var i=0; i<results.activities.length; i++){
      var isAssigned = false;
      var n = results.activities[i].required;
      for(var j=0; j<results.tasks.length; j++){
        if(results.activities[i].id_activity == results.tasks[j].id_activity){
          n -= 1;
        }
      }
      if(n > 0){
        noAssigned.push({data: results.activities[i], count: n});
      }
    }
    res.send({activities: noAssigned});
  });
};

exports.activityDetails =  function(req, res){
  Activity.findOne({
    id_installation:req.body.id_installation,
    id_activity: req.body.id_activity
  })
  .exec(function(err,activity){
    if(err)
      res.send({status:false});
    res.send({activity: activity});
  });
};

exports.updateTask = function(req,res){
  var state = req.body.state;
  var current = Date.now();
  Task.update(
    { id_task: req.body.id_task },
    {
      state : state, $push: { track: {state:state,update_at:current} },
      update_at: current
    },
    function(err,task){
      if(err)
        return res.send(500,err);
      updateEmployee(req.body.id_installation,req.body.id_employee);
      res.json(200,{task:task});
    }
  );
}

function updateEmployee(id_installation,id_employee){
  var curr = new Date().getTime()
  var conditions = {id_installation: id_installation, id_employee: id_employee};
  var query = {sync_tasks: curr};
  Employee.update(conditions, query, function(err){
    if(err)
      console.log(err);
  });
}
