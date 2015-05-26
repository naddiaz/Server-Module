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
      //var key = new NodeRSA();
      var buf = new Buffer(text, 'base64');
      console.log(buf);
      var privateKey = '/server/server.private.pem';
      //key.importKey(fs.readFileSync(path.join(__dirname, '../cert') + privateKey),'pkcs8');
      var pem = fs.readFileSync(path.join(__dirname, '../cert') + privateKey);
      //var key = new NodeRSA(pem);
      //return key.decrypt(buf);

var exec = require('exec');

fs.writeFileSync("data.bin",buf);
fs.writeFileSync("key.pem",pem);

    exec(['openssl', 'pkeyutl', '-decrypt', '-in', 'data.bin', '-inkey', 'key.pem', '-out', 'response.json'], function(err, out, code) {
        if (err instanceof Error)
          throw err;
        process.stderr.write(err);
        process.stdout.write(out);
    });
var json = fs.readFileSync("response.json");

//fs.unlinkSync("data.bin");
//fs.unlinkSync("key.pem");
//fs.unlinkSync("response.json");
exec(['rm','-rf','data.bin','key.pem','response.json'],function(err,out,code){
   if(err instanceof Error)
      throw err;
   process.stderr.write(err);
   process.stdout.write(out);
});
console.log(json.toString());
      return "TEST";
}

exports.verify = function(text,signature,airport,employee){
      var key = new NodeRSA();
      var publicKey = '/employees/a' + airport + 'e' + employee + '/a' + airport + 'e' + employee + '.public.der';
      key.importKey(fs.readFileSync(path.join(__dirname, '../cert') + publicKey),'pkcs8-public-der');
      return key.verify(text,signature,"UTF-8","base64");
}
