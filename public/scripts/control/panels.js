(function(){
  employeesStates();
  assignedTasks();
  activeTasks();
  completedTasks();
  pausedTasks();
  canceledTasks();
  noAssignedActivities();
  $("#tabs-refresh").click(function(){
    $("#tabs-refresh > i").addClass("i-refresh-animation");
    var ajax = employeesStates();
    ajax.done(function(){
      $("#tabs-refresh > i").removeClass("i-refresh-animation");
    });
    assignedTasks();
    activeTasks();
    completedTasks();
    pausedTasks();
    canceledTasks();
    noAssignedActivities();
  });
})();


function formatFullDate(time){
  var date = new Date(time)
  var hour = (date.getHours() < 10)? '0'+date.getHours() : date.getHours();
  var minutes = (date.getMinutes() < 10)? '0'+date.getMinutes() : date.getMinutes();
  var day = (date.getDate() < 10)? '0'+date.getDate() : date.getDate();
  var month = (date.getMonth()+1 < 10)? '0'+(date.getMonth()+1) : date.getMonth()+1;
  var year = date.getFullYear();
  return hour + ":" + minutes + " - " + day + "/" + month + "/" + year;
}

function formatTime(minutes){
  return getPartNumber(minutes/60,'int')+ "h " +  (minutes%60) + "m";
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
    streetViewControl: false,
    mapTypeControl: false,
    scrollwheel: false,
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


function historyEvent(item,id){
  $(item).click(function(){
    window.location.href = '/installation/' + ID_INSTALLATION + "/" + id + "?name=" + ADMIN_NAME + "&id=" + ADMIN_ID;
  });
}

function detailsEvent(id){
  $(id).click(function(){
    details(id.split('-')[2]);
  });
  $(id).magnificPopup({
    removalDelay: 250,
    callbacks: {
      beforeOpen: function() {
         this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    midClick: true
  });
}

function details(id){
  var detailsContent = $("#details-content");
  var data = {
    id_installation: ID_INSTALLATION,
    id_activity: id
  }
  $.ajax({
    url:"/helper/control/activityDetails",
    type:"POST",
    data: data,
    success:function(data) {
      $("#details-title").html("ID: " + data.activity.id_activity);

      var html = "";
      html += "<div class='span6'>"
      html += "<div class='row-fluid'>";
      html += "<div class='span6'><strong>ID activity:</strong> " + data.activity.id_activity + "</div>";
      html += "<div class='span6'><strong>Category:</strong> " + data.activity.category + "</div>";
      html += "</div><div class='row-fluid'>";
      html += "<div class='span6'><strong>Priority:</strong> " + data.activity.priority + "</div>";
      html += "<div class='span6'><strong>Required:</strong> " + data.activity.required + "</div>";
      html += "</div><div class='row-fluid'>";
      html += "<div class='span6'><strong>Estimated Time:</strong> " + formatTime(data.activity.time) + "</div>";
      html += "<div class='span6'><strong>Register:</strong> " + formatFullDate(data.activity.created_at) + "</div>";
      html += "</div><div class='row-fluid'>";
      html += "<div class='span12'><strong>Description:</strong> " + data.activity.description + "</div>";
      html += "</div></div>";
      html += "<div class='span6'><div id='map_canvas'></div></div>";

      detailsContent.html(html);
      initMap(data.activity.location.latitude,data.activity.location.longitude);
    }
  });
}