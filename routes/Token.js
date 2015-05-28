var crypto = require('crypto');
var fs = require('fs');

exports.generate = function(text){
  var md5sum = crypto.createHash('md5');
  md5sum.update(text);
  var d = md5sum.digest('hex');
  return d;
};
