'use strict';

var fs = require('fs')
  , NodeRSA = require('node-rsa')
  , path = require('path') 
  ;

exports.encrypt = function(text,airport,employee){
      var key = new NodeRSA();
      var arr = new Array(arguments.length);
      var publicKey = '/employees/a' + airport + 'e' + employee + '/a' + airport + 'e' + employee + '.public.der';
      key.importKey(fs.readFileSync(path.join(__dirname, '../cert') + publicKey),'pkcs8-public-der');
      return key.encrypt(text,"base64");
}

exports.sign = function(text,airport,employee){
      var key = new NodeRSA();
      var arr = new Array(arguments.length);
      var privateKey = '/server/server.private.pem';
      key.importKey(fs.readFileSync(path.join(__dirname, '../cert') + privateKey),'pkcs8');
      return key.sign(text,"base64");
}