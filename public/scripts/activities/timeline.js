var Timeline = function(data){

  this.exec = function(){
    $(".timeline").html("");
    $(".timeline").append("<div id='steps'></div><div id='marks'></div>");
    var timelineSteps = $('#steps');
    var timelineMarks = $('#marks');
    var steps = calcSteps(data);
    var last = 0;
    for(var i=0; i<steps.length; i++){
      var x = timelineSteps.width()*steps[i]/100;

      var stepHTML = "<div class='step st"+data.state[i-1]+"' style='width:"+(x-last-1.3)+"px;' title='"+data.name[data.state[i-1]]+"'></div>"
      timelineSteps.append(stepHTML);

      var stepHTML = "<div class='mark' style='margin-left:"+(x-last-12)+"px;'><div>"+formatHour(data.hour[i])+"</div></div>"
      timelineMarks.append(stepHTML);
      
      last = x;
    }
    if(data.state[data.state.length-1] == 4 || data.state[data.state.length-1] == 5){
      var sts = $("#steps > .step");
      var stswd = sts[sts.length-1].style.width;
      stswd = stswd.substring(0,stswd.length-2);
      sts[sts.length-1].style.width = stswd-10 +"px";
      timelineSteps.append("<div class='step-finish st"+data.state[data.state.length-1]+"' style='width:10px;' title='"+data.name[data.state[data.state.length-1]]+"'></div>");
    }
  }

  function calcSteps(data){
    if(data.hour.length >= 2){
      var steps = [];
      var diff = hourToMinutes(data.hour[data.hour.length-1])-hourToMinutes(data.hour[0]);
      for(var i=0; i<data.hour.length; i++){
        steps.push(step(hourToMinutes(data.hour[i])-hourToMinutes(data.hour[0]),diff));
      }
      return steps;
    }
    return [];
  }

  function step(val,diff){
    return (val*100)/(diff);
  }

  function hourToMinutes(number){
    number = parseFloat(number.split(':')[0] + "." + number.split(':')[1])
    var hour = getPartNumber(number,'int');
    var minutes = getPartNumber(number,'frac',2);
    hour = (hour < 10) ? '0'+hour : hour;
    minutes = (minutes < 10) ? '0'+minutes : minutes;
    return parseInt(hour)*60+parseInt(minutes);
  }

  function formatHour(number){
    number = parseFloat(number.split(':')[0] + "." + number.split(':')[1])
    var hour = getPartNumber(number,'int');
    var minutes = getPartNumber(number,'frac',2);
    hour = (hour < 10) ? '0'+hour : hour;
    minutes = (minutes < 10) ? '0'+minutes : minutes;
    return hour+":"+minutes;
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

  return this;
}

var data = {
  hour:  ['11:31','11:34','11:59','12:10','12:49','12:59','13:27'],
  state: [1,2,3,2,3,2,4],
  name:  ['No Assign','Assigned','Active','Paused','Completed','Canceled']
};
$(document).ready(function(){
  new Timeline(data).exec();
});
$(window).resize(function(){
  new Timeline(data).exec();
});