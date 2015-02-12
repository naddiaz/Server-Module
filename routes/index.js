
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'BLE Task: MAPA'});
};

exports.ws = function(req, res){
  var currentTime = new Date();
  data = {
    second: currentTime.getSeconds(),
    minute: currentTime.getMinutes(),
    hour: currentTime.getHours(),
    day: currentTime.getDay()+1,
    month: currentTime.getMonth()+1,
    year: currentTime.getFullYear()
  };
  res.json(data);
};

exports.wsf = function(req, res){
  var year = parseInt(req.params.year);
  var month = parseInt(req.params.month) - 1;
  var day = parseInt(req.params.day);

  var find_date = new Date();
  find_date.setFullYear(year,month,day);

  var actual_date = new Date();

  var diff_date = actual_date.days(find_date);

  var days_name = new Array("Sunday","Monday","Tuesday","Wenesday","Thursday","Friday","Saturday");
  data = {
    actual: actual_date,
    date: find_date,
    diff: diff_date,
    day_week: days_name[find_date.getUTCDay()]
  };
  res.json(data);
};

Date.prototype.days=function(to){
  return  Math.abs(Math.floor( to.getTime() / (3600*24*1000)) -  Math.floor( this.getTime() / (3600*24*1000)))
}

