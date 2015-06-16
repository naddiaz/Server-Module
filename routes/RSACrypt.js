'use strict';

var fs = require('fs')
  , NodeRSA = require('node-rsa')
  , path = require('path') 
  ;
var MAX_LENGTH = 127;
var PATH = "/var/www/tfg.naddiaz.com/Server-Module/";

exports.encrypt = function(text,airport,employee){
     var exec = require('exec');
     var execSync = require('exec-sync');
     var publicKeyPath = PATH + 'cert/employees/a' + airport + 'e' + employee + '/a' + airport + 'e' + employee + '.public.der';
     var dirname = "d" + random();
     var response = null;
     execSync('mkdir ' +  PATH + 'temp/' + dirname);
     fs.writeFileSync('temp/' + dirname + '/message.raw',text);
     var message = fs.readFileSync('temp/' + dirname + '/message.raw');
     console.log(message);
     console.log(message.length);
     if(message.length <= MAX_LENGTH){
       execSync('openssl pkeyutl -encrypt -in temp/' + dirname + '/message.raw -pubin -keyform der -inkey ' + publicKeyPath + ' -out temp/' + dirname + '/cipher.bin');
       execSync('openssl enc -base64 -in temp/' + dirname + '/cipher.bin -out temp/' + dirname + '/cipher.b64');
     }
     else{
        var i = 0;
	while(i<message.length){
	   var sliceMessage = message.slice(i,i+MAX_LENGTH);
	   console.log("SLICE: " + sliceMessage);
	   fs.writeFileSync('temp/' + dirname + '/cipher.part.' + i,sliceMessage); 
	   execSync('openssl pkeyutl -encrypt -in temp/' + dirname + '/cipher.part.' + i + ' -pubin -keyform der -inkey ' + publicKeyPath + ' -out temp/' + dirname + '/cipher.bin.' + i);
           execSync('openssl enc -base64 -in temp/' + dirname + '/cipher.bin.' + i + ' -out temp/' + dirname + '/cipher.b64.' + i);
	   i = i+MAX_LENGTH;
	}
	var merge = execSync('head -c -1 -q temp/' + dirname + '/cipher.b64.*');
        console.log("MERGE: " + merge);
     	fs.writeFileSync('temp/' + dirname + '/cipher.b64',merge);
     }
     response = fs.readFileSync('temp/' + dirname + '/cipher.b64');
/*     exec(['rm','-rf','temp/' + dirname],function(err,out,code){
       if(err instanceof Error){
          throw err;
       }
     });*/
     return response.toString();
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
