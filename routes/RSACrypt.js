'use strict';

var fs = require('fs')
  , NodeRSA = require('node-rsa')
  ;

exports.encrypt = function(text,airport,employee){
      var key = new NodeRSA();
      var arr = new Array(arguments.length);
      var publicKey = './cert/employees/a' + airport + 'e' + employee + '/a' + airport + 'e' + employee + '.public.der';
      key.importKey(fs.readFileSync(publicKey),'pkcs8-public-der');
      return key.encrypt(text,"base64");
}

exports.sign = function(text,airport,employee){
      var key = new NodeRSA();
      var arr = new Array(arguments.length);
      var privateKey = './cert/server/server.private.pem';
      key.importKey(fs.readFileSync(privateKey),'pkcs8');
      return key.sign(text,"base64");
}