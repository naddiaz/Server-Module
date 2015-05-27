'use strict';

var fs = require('fs')
  , NodeRSA = require('node-rsa')
  , path = require('path') 
  ;

exports.encrypt = function(text,airport,employee){
      var key = new NodeRSA();
      var publicKey = '/employees/a' + airport + 'e' + employee + '/a' + airport + 'e' + employee + '.public.der';
      key.importKey(fs.readFileSync(path.join(__dirname, '../cert') + publicKey),'pkcs8-public-der');
      return key.encrypt(text,"base64");
}

exports.sign = function(text){
      var key = new NodeRSA();
      var privateKey = '/server/server.private.pem';
      key.importKey(fs.readFileSync(path.join(__dirname, '../cert') + privateKey),'pkcs8');
      return key.sign(text,"base64");
}

exports.decrypt = function(text){
  //Base 64 to Buffer encrypted text
  var exec = require('exec');
  var execSync = require('exec-sync');  
  var buffer = new Buffer(text, 'base64');
  //Read private server key
  var privateKey = fs.readFileSync(path.join(__dirname, '../cert') + '/server/server.private.pem');
  var dirname = "d" + random();
  //Creamos el subdirectorio (dirname) dentro de temp
  var json = null;
  execSync('mkdir temp/' + dirname);
  fs.writeFileSync(path.join(__dirname, '../temp/') + dirname + "/data.bin",buffer);
  execSync('openssl pkeyutl -decrypt -in temp/' + dirname + '/data.bin -inkey cert/server/server.private.pem -out temp/' + dirname + '/response.json');
  json = fs.readFileSync('temp/' + dirname + '/response.json');
  exec(['rm','-rf','temp/' + dirname],function(err,out,code){
     if(err instanceof Error){
        throw err;
     }
  });
  if(json != null)
    return json.toString();
  else
    return "TEST";
}

exports.verify = function(text,signature,airport,employee){
      var key = new NodeRSA();
      var publicKey = '/employees/a' + airport + 'e' + employee + '/a' + airport + 'e' + employee + '.public.der';
      key.importKey(fs.readFileSync(path.join(__dirname, '../cert') + publicKey),'pkcs8-public-der');
      return key.verify(text,signature,"UTF-8","base64");
}

function random () {
  var low = Math.random();
  var high = Math.random() + low;
  return Math.random() * (high - low) + low;
}
