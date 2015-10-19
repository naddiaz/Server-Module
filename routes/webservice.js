var Mongoose = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Employee     = Mongoose.model( 'Employee' );
var Task         = Mongoose.model( 'Task' );
var Activity     = Mongoose.model( 'Activity' );

exports.login =  function(req, res){
  Employee
    .findOne({id_installation: req.body.id_installation, id_employee: req.body.id_employee})
    .select("id_installation id_employee name last_name category gcm hash")
    .exec(function(err,employee){
      if(err)
        return res.send(500, err);
      res.json(200,employee);
    });
};

exports.employeeGcm =  function(req, res){
  var conditions = {id_installation: req.body.id_installation, id_employee: req.body.id_employee};
  var query = {gcm: req.body.gcm};
  Employee.update(conditions, query, function(err, employee){
    if(err)
      return res.send(500, err);
    res.json(200,{status: true});
  });
};

exports.tasks = function(req, res){
  Employee
    .findOne({id_installation: req.body.id_installation, id_employee: req.body.id_employee})
    .select('sync_tasks')
    .exec(function(err,employee){
      var lastUpdate = new Date(Number(req.body.sync_tasks));
      var employeeUpdate = new Date(Number(employee.sync_tasks));
      if(req.body.sync_tasks < employee.sync_tasks){
        Task
          .find({
            id_installation: req.body.id_installation,
            id_employee: req.body.id_employee,
            update_at: {$gte: lastUpdate}
          })
          .select("id_installation id_employee id_activity id_task state time created_at")
          .sort({created_at: 1})
          .exec(function(err,tasks){
            if(err)
              return res.send(500, err);
            console.log(tasks);
            res.json(200, tasks);
          });
      }
      else{
        res.json(200, [{sync_tasks: true}]);
      }
    });
}

exports.activity = function(req, res){
  Activity
    .findOne({id_installation: req.body.id_installation, id_activity: req.body.id_activity})
    .exec(function(err,activity){
      if(err)
        return res.send(500, err);
      res.json(200, activity);
    });
}

exports.taskInfo = function(req, res){
  Task
    .findOne({id_installation: req.body.id_installation, id_task: req.body.id_task})
    .exec(function(err,task){
      if(err)
        return res.send(500, err);
      Activity
        .findOne({id_installation: req.body.id_installation, id_activity: task.id_activity})
        .exec(function(err,activity){
          if(err)
            return res.send(500, err);

          var data = {
            id_installation: activity.id_installation,
            id_activity: activity.id_activity,
            category: activity.category,
            priority: activity.priority,
            required: activity.required,
            time: activity.time,
            description: activity.description,
            created_at: activity.created_at,
            id_task: task.id_task,
            state: task.state,
            track: task.track
          }
          res.json(200,data);
        });
    });
}

var gcm = require('node-gcm');
exports.testGcm = function(req, res){
  var message = new gcm.Message();
  message.addData({
    title: "New Tasks",
    description: "This is a test notification"
  });

  var sender = new gcm.Sender("AIzaSyAra20M9PTtUj1QXoCaTq-FrzVRsdl4SlA");
  Employee
    .findOne({id_installation: req.params.id_installation, id_employee: req.params.id_employee})
    .select('gcm')
    .exec(function(err,employee){
      var regIds = [employee.gcm];
      sender.send(message, regIds, function (err, result) {
        if(err){
          return res.send(500,err);
        }
        res.json(200,{status: true});
      });
    });
}
