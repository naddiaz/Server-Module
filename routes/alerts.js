
var i18n         = require('i18n');

exports.error =  function(req, res){
  var code = req.body.code;
  console.log(code)
  i18n.setLocale(res.locale)
  res.send({
    message: i18n.__("alerts.error." + code)
  })
};