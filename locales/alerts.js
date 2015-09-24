
var i18n         = require('i18n');

exports.error =  function(req, res){
  var code = req.params.code;
  console.log(i18n)
  console.log(i18n.getLocale())
  console.log(i18n.setLocale('en'))
  console.log(i18n.getLocale())
  console.log(i18n.__("activities.weight.minutes"))
  res.send({
    message: i18n.__("activities.weight.minutes")
  })
};