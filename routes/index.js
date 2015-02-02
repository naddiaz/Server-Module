
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