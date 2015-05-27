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
  var buffer = new Buffer(text, 'base64');
  //Read private server key
  var privateKey = fs.readFileSync(path.join(__dirname, '../cert') + '/server/server.private.pem');
  var dirname = "d" + random();
  //Creamos el subdirectorio (dirname) dentro de temp
  var json = null;
  exec(['mkdir','temp/' + dirname],function(err,out,code){
    if(err instanceof Error){
      throw err;
    }
    else{
      //Creamos un archivo que contiene los datos del buffer
      fs.writeFileSync(path.join(__dirname, '../temp/') + dirname + "/data.bin",buffer);
      //Con la clave y los datos en ficheros ejecutamos openssl
      exec(['openssl', 'pkeyutl',
        '-decrypt', '-in', 'temp/' + dirname + '/data.bin',
        '-inkey', 'cert/server/server.private.pem',
        '-out', 'temp/' + dirname + '/response.json'],
      function(err, out, code) {
        if(err instanceof Error){
          throw err;
        }
        else{
          //Guardamos la aplicacion en la variable json
          json = fs.readFileSync('temp/' + dirname + '/response.json');
          //Eliminamos el directorio temporal
          exec(['rm','-rf','temp/' + dirname],function(err,out,code){
             if(err instanceof Error)
                throw err;
             process.stderr.write(err);
             process.stdout.write(out);
          });
        }
      });
    }
  });
  if(json != null)
    return json;
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