(function init(){
  loadingBar();
  averageTasks();
  var now = moment().format("DD/MM/YYYY");
  $("#tasks-date").html(now);
  loadTasks(now);
  $("#prev-date").click(function(){
    loadingBar();
    var prev = moveDate('prev');
    loadTasks(prev);
  });
  $("#next-date").click(function(){
    loadingBar();
    var next = moveDate('next');
    loadTasks(next);
  });
  $("#task-refresh").click(function(){
    loadingBar();
    var refresh = moveDate('refresh');
    loadTasks(refresh);
  });
  $("#stats-refresh").click(function(){
    averageTasks();
  });
})();

function moveDate(way){
  var actualHTML = $("#tasks-date").html();
  var actualDate = moment(actualHTML, "DD/MM/YYYY");
  if(way == 'prev'){
    actualDate.subtract(1,'days');
  }
  else if(way == 'next'){
    actualDate.add(1,'days');
  }
  $("#tasks-date").html(actualDate.format("DD/MM/YYYY"));
  return actualDate.format("DD/MM/YYYY");
}

function loadingBar(){
  $("#tasks").html('<div class="progress progress-striped progress-success active"><div class="bar" style="width: 100%;"></div></div>');
}

function loadTasks(current){
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: ID_EMPLOYEE,
    date: current
  }
  $.ajax({
    url:"/helper/history/loadTasks",
    type:"POST",
    data: data,
    success:function(data) {
      var tasksList = $("#tasks");
      tasksList.html("");
      if(data.tasks.length==0){
        var li = "<li>Nothing to show</li>";
        tasksList.append(li);
      }
      else{
        for(var i in data.tasks){
          var li = "<li id='tasks_"+data.tasks[i].id_task+"' data-effect='mfp-zoom-in'><a href='#tasks-popup'><i class='fa fa-eye st" + data.tasks[i].state + "'></i>" + data.tasks[i].id_task + "</a></li>";
          tasksList.append(li);
          taskEvent(data.tasks[i].id_task);
        }
      }
    }
  });
};


var circle = {
  radius:              60,
  width:               10,
  text:                function(value){return value + '%';},
  duration:            400,
  wrpClass:            'circles-wrp',
  textClass:           'circles-text',
  valueStrokeClass:    'circles-valueStroke',
  maxValueStrokeClass: 'circles-maxValueStroke',
  styleWrapper:        true,
  styleText:           true,
  maxValue:            100,
  colors:              ["#cccccc","#f2f2f2"]
}

function averageTasks(){
  var data = {
    id_installation: ID_INSTALLATION,
    id_employee: ID_EMPLOYEE
  }
  $.ajax({
    url:"/helper/history/averageTasks",
    type:"POST",
    data: data,
    success:function(data) {
        circle.colors = ["#cccccc","#f2f2f2"];
        circle.id = 'avg-elapsed';
        circle.value = data.acc.elapsed;
        Circles.create(circle);
        circle.id = 'avg-offset';
        circle.value = data.acc.offset;
        Circles.create(circle);
        circle.id = 'avg-active';
        circle.value = data.acc.active;
        Circles.create(circle);
        circle.id = 'avg-paused';
        circle.value = data.acc.paused;
        Circles.create(circle);
        circle.id = 'avg-completed';
        circle.value = data.acc.completed;
        Circles.create(circle);
        circle.id = 'avg-canceled';
        circle.value = data.acc.canceled;
        Circles.create(circle);
    }
  });
};

function taskEvent(id){
  $("#tasks_"+id).click(function(){
    var tasksDetails = $("#tasks-details");
    //tasksDetails.html('<tr><td colspan="3"><div class="progress progress-striped progress-success active"><div class="bar" style="width: 100%;"></div></div></td></tr>');
    var data = {
      id_installation: ID_INSTALLATION,
      id_employee: ID_EMPLOYEE,
      id_task: id
    }
    $.ajax({
      url:"/helper/history/loadTasksDetails",
      type:"POST",
      data: data,
      success:function(data) {
        var timelineData = {
          name:  ['No Assign','Assigned','Active','Paused','Completed','Canceled'],
          hour: [],
          state : []
        };

        $("#tasks-details-title").html("ID: " + data.task.id_task);
        tasksDetails.html("");
        var html = "";
        html += "<div class='span6'>"
        html += "<div class='row-fluid'>";
        html += "<div class='span6'><strong>ID activity:</strong> " + data.activity.id_activity + "</div>";
        html += "<div class='span6'><strong>Actual state:</strong> " + timelineData.name[data.task.state] + "</div>";
        html += "</div><div class='row-fluid'>";
        html += "<div class='span6'><strong>Priority:</strong> " + data.activity.priority + "</div>";
        html += "<div class='span6'><strong>Required:</strong> " + data.activity.required + "</div>";
        html += "</div><div class='row-fluid'>";
        html += "<div class='span6'><strong>Estimated Time:</strong> " + formatTime(data.activity.time) + "</div>";
        html += "<div class='span6'><strong>Register:</strong> " + formatFullDate(data.activity.created_at) + "</div>";
        html += "</div><div class='row-fluid'>";
        html += "<div class='span12'><strong>Description:</strong> " + data.activity.description + "</div>";
        html += "</div><div class='row-fluid'>";
        html += "<div class='span12'><h3>Timeline</h3><div class='timeline'></div></div>";
        html += "</div><div class='row-fluid' id='data-stats'>";
        html += "<div class='span3'><h3>Elapsed Time</h3><div class='circle' id='circles-elapsed'></div></div>";
        html += "<div class='span3'><h3>Offset Time</h3><div class='circle' id='circles-offset'></div></div>";
        html += "<div class='span3'><h3>Active Time</h3><div class='circle' id='circles-active'></div></div>";
        html += "<div class='span3'><h3>Paused Time</h3><div class='circle' id='circles-paused'></div></div>";
        html += "</div></div>";
        html += "<div class='span6'><div id='map_canvas'></div></div>";
        tasksDetails.append(html);

        var activeTime = [];
        var pausedTime = [];
        var totalTime = [];
        var actual = 0;
        for(var i in data.task.track){
          var date = new Date(data.task.track[i].update_at);
          var hour = (date.getHours() < 10)? '0'+date.getHours() : date.getHours();
          var minutes = (date.getMinutes() < 10)? '0'+date.getMinutes() : date.getMinutes();
          timelineData.hour.push(hour+":"+minutes);
          timelineData.state.push(data.task.track[i].state);

          if(data.task.state == 4 || data.task.state == 5){
            if(i==0){
              totalTime.push(timeToMinutes(hour,minutes));
            }
            else if(i==data.task.track.length-1){
              totalTime.push(timeToMinutes(hour,minutes));
            }
            if(data.task.track[i].state == 2){
              activeTime.push(timeToMinutes(hour,minutes));
              if(actual == 3){
                pausedTime.push(timeToMinutes(hour,minutes));
              }
            }
            else if(data.task.track[i].state == 3){
              pausedTime.push(timeToMinutes(hour,minutes));
              if(actual == 2){
                activeTime.push(timeToMinutes(hour,minutes));
              }
            }
            else if(data.task.track[i].state == 4 || data.task.track[i].state == 5){
              if(actual == 2){
                activeTime.push(timeToMinutes(hour,minutes));
              }
              if(actual == 3){
                pausedTime.push(timeToMinutes(hour,minutes));
              }
            }
            actual = data.task.track[i].state;
          }
          else{
            $("#data-stats").html("<p>The statistics are not available until the task is finished</p>");
          }
        }
        var active = 0;
        for(var i=0; i<activeTime.length; i+=2){
          active += activeTime[i+1] - activeTime[i];
        }

        var paused = 0;
        for(var i=0; i<pausedTime.length; i+=2){
          paused += pausedTime[i+1] - pausedTime[i];
        }

        var total = 0;
        for(var i=0; i<totalTime.length; i+=2){
          total += totalTime[i+1] - totalTime[i];
        }

        circle.id = 'circles-elapsed';
        circle.value = total*100/data.task.time;
        circle.maxValue = 100;
        circle.colors = ['#FF8A80', '#F44336'];
        Circles.create(circle);

        circle.id = 'circles-offset';
        circle.value = (total*100/data.task.time)-100;
        circle.maxValue = (((total*100/data.task.time)-100) > 100) ? (total*100/data.task.time)-100 : 100;
        circle.colors = ['#FF8A80', '#F44336'];
        Circles.create(circle);

        circle.id = 'circles-active';
        circle.value = active*100/total;
        circle.maxValue = 100;
        circle.colors = ['#78CDC7', '#43B5AD'];
        Circles.create(circle);

        circle.id = 'circles-paused';
        circle.value = paused*100/total;
        circle.maxValue = 100;
        circle.colors = ['#EAD289', '#DEB948'];
        Circles.create(circle);

        initMap(data.activity.location.latitude,data.activity.location.longitude);
        new Timeline(timelineData).exec();
      }
    });
  });
  $("#tasks_"+id).magnificPopup({
    delegate: 'a',
    removalDelay: 250,
    callbacks: {
      beforeOpen: function() {
         this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    midClick: true
  });
}

function formatTime(minutes){
  return getPartNumber(minutes/60,'int')+ "h " +  (minutes%60) + "m";
}

function timeToMinutes(hour,minutes){
  return parseInt(hour)*60+parseInt(minutes);
}

function formatFullDate(time){
  var date = new Date(time)
  var hour = (date.getHours() < 10)? '0'+date.getHours() : date.getHours();
  var minutes = (date.getMinutes() < 10)? '0'+date.getMinutes() : date.getMinutes();
  var day = (date.getDate() < 10)? '0'+date.getDate() : date.getDate();
  var month = (date.getMonth()+1 < 10)? '0'+(date.getMonth()+1) : date.getMonth()+1;
  var year = date.getFullYear();
  return hour + ":" + minutes + " - " + day + "/" + month + "/" + year;
}

STYLE =[
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

function initMap(latitude,longitude) {
  var mapOptions = {
    center: new google.maps.LatLng(latitude,longitude),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: STYLE
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
  paintActivityCircle(map,latitude,longitude)
}

function paintActivityCircle(map,latitude,longitude){
  var center = new google.maps.LatLng(latitude,longitude);
  new google.maps.Circle({
    strokeWeight: 0,
    fillColor: '#F44336',
    fillOpacity: 1,
    map: map,
    center: center,
    radius: 3,
    zIndex:10000
  });
}

function getPartNumber(number,part,decimals) {
  if ((decimals <= 0) || (decimals == null)) decimals =1;
  decimals = Math.pow(10,decimals);

  var intPart = Math.floor(number);
  var fracPart = (number % 1)*decimals;
  fracPart = fracPart.toFixed(0);
  if (part == 'int')
    return intPart;
  else
    return fracPart;
}