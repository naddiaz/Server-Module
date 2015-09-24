var Async        = require("async");
var Mongoose     = require( 'mongoose' );

var Installation = Mongoose.model( 'Installation' );
var Employee     = Mongoose.model( 'Employee' );
var Category     = Mongoose.model( 'Category' );
var Activity     = Mongoose.model( 'Activity' );
var Task         = Mongoose.model( 'Task' );

exports.home =  function(req, res){
  Employee.findOne({id_installation: req.params.id_installation,id_employee: req.params.id_employee}).exec(function(err,employee){
    if(!err)
      res.render('history',{
        id_installation: req.params.id_installation,
        employee: employee,
        admin : {
          name: req.query.name,
          id: req.query.id
        }
      });
  });
};

function timeToMinutes(hour,minutes){
  return parseInt(hour)*60+parseInt(minutes);
}

exports.averageTasks =  function(req, res){
  Task.find({
    id_installation:req.body.id_installation,
    id_employee:req.body.id_employee
  }).exec(function(err,tasks){
    if(err)
      res.send({status:false});

    
    var accumulated = {
      active: 0,
      paused: 0,
      elapsed: 0,
      offset: 0,
      completed: 0,
      canceled: 0,
      data: 0
    };

    for(var j in tasks){
      var actual = 0;
      var time = {
        active: [],
        paused: [],
        total: []
      };
      if(tasks[j].state == 4 || tasks[j].state == 5){
        for(var i in tasks[j].track){
          var date = new Date(tasks[j].track[i].update_at);
          var hour = (date.getHours() < 10)? '0'+date.getHours() : date.getHours();
          var minutes = (date.getMinutes() < 10)? '0'+date.getMinutes() : date.getMinutes();

          if(i==0){
            time.total.push(timeToMinutes(hour,minutes));
          }
          else if(i==tasks[j].track.length-1){
            time.total.push(timeToMinutes(hour,minutes));
          }
          if(tasks[j].track[i].state == 2){
            time.active.push(timeToMinutes(hour,minutes));
            if(actual == 3){
              time.paused.push(timeToMinutes(hour,minutes));
            }
          }
          else if(tasks[j].track[i].state == 3){
            time.paused.push(timeToMinutes(hour,minutes));
            if(actual == 2){
              time.active.push(timeToMinutes(hour,minutes));
            }
          }
          else if(tasks[j].track[i].state == 4 || tasks[j].track[i].state == 5){
            if(actual == 2){
              time.active.push(timeToMinutes(hour,minutes));
            }
            if(actual == 3){
              time.paused.push(timeToMinutes(hour,minutes));
            }
          }
          actual = tasks[j].track[i].state;
        }
      if(tasks[j].state == 4){
        accumulated.completed += 1;
      }
      else if(tasks[j].state == 5){
        accumulated.canceled += 1;
      }
      var active = 0;
      for(var i=0; i<time.active.length; i+=2){
        active += time.active[i+1] - time.active[i];
      }

      var paused = 0;
      for(var i=0; i<time.paused.length; i+=2){
        paused += time.paused[i+1] - time.paused[i];
      }

      var total = 0;
      for(var i=0; i<time.total.length; i+=2){
        total += time.total[i+1] - time.total[i];
      }

      
      accumulated.active += active*100/total;
      accumulated.paused += paused*100/total;
      accumulated.elapsed += total*100/tasks[j].time;
      accumulated.data += 1;

      }
    }
    if(accumulated.data > 0){
      accumulated.active /= accumulated.data;
      accumulated.paused /= accumulated.data;
      accumulated.completed = accumulated.completed*100/accumulated.data;
      accumulated.canceled = accumulated.canceled*100/accumulated.data;
      accumulated.offset = (accumulated.elapsed/accumulated.data > 100) ? accumulated.elapsed/accumulated.data-100 : 0;
      accumulated.elapsed = (accumulated.elapsed/accumulated.data > 100) ? 100 : accumulated.elapsed/accumulated.data;
    }
    res.send({acc: accumulated});
  });
}

exports.loadTasks =  function(req, res){

  var current = req.body.date.split("/");
  var day = current[0];
  var month = current[1];
  var year = current[2];

  var start = new Date(year, month-1, day,0,0,0,0);
  var end = new Date(year, month-1, day,0,0,0,0);
  end.setDate(start.getDate()+1)

  Task.find({
    id_installation:req.body.id_installation,
    id_employee:req.body.id_employee,
    created_at: {$gte: start, $lt: end}
  }).exec(function(err,tasks){
    if(!err)
      res.send({tasks: tasks});
  });
};

exports.loadTasksDetails =  function(req, res){
  Task.findOne({id_installation:req.body.id_installation, id_employee:req.body.id_employee, id_task: req.body.id_task}).exec(function(err,task){
    if(!err){
      Activity.findOne({id_installation:req.body.id_installation, id_activity: task.id_activity}).exec(function(err,activity){
        if(!err){
          res.send({
            task: task,
            activity: activity
          });
        }
      });
    }
  });
};
