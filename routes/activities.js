
var Mongoose     = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Employee     = Mongoose.model( 'Employee' );
var Activity     = Mongoose.model( 'Activity' );
var Task         = Mongoose.model( 'Task' );

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
    category: req.body.category,
    priority: req.body.priority,
    required: req.body.required,
    time: time,
    description: req.body.description,
    created_at: current,
    update_at: current
  });
  console.log(activity)
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
            created_at: current
          });
          taskList.push(task);
          task.save();
        }
        console.log(taskList)
        res.send({activity:activity,task:taskList});
      }
    });
  }
};
