async = require("async");

var Mongoose = require( 'mongoose' );
var Installation = Mongoose.model( 'Installation' );
var Employee     = Mongoose.model( 'Employee' );
var Category     = Mongoose.model( 'Category' );

//RSACrypt = require('./RSACrypt.js');
//Token = require('./Token.js');

exports.home =  function(req, res){
  var id_installation = req.params.id_installation;
  res.render('employees',{
    id_installation: id_installation,
    admin : {
      name: req.query.name,
      id: req.query.id
    }
  });
};

exports.save =  function(req, res){
  var currentTime = Date.now();
  new Employee({
    id_installation: req.body.id_installation,
    id_employee: req.body.id_employee,
    name: req.body.name,
    last_name: "...",
    category: req.body.category,
    device: req.body.device,
    created_at: currentTime,
    update_at: currentTime,
    gcm: "...",
    hash: hashCalculate(req.body.id_installation,req.body.id_employee,req.body.name,currentTime)
  }).save( function(err){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};

exports.delete =  function(req, res){
  Employee.remove({
    id_installation: req.body.id_installation,
    id_person: req.body.id_person
  }, function(){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};

exports.employeesList =  function(req, res){
  Employee.find({
    id_installation: req.body.id_installation
  }).sort({'created_at': -1}).select('id_employee name last_name category device')
  .exec(function(err,people){
    res.send({
      people: people
    });
  });
};

exports.nextEmployeeId =  function(req, res){
  Employee.findOne({
    id_installation: req.body.id_installation
  }, {}, { sort: { 'created_at' : -1 } }, function(err, last) {
    if(last == null)
      res.send({id_employee:'E-0'});
    else
      res.send({id_employee:last.id_employee});
  });
};

exports.updateName =  function(req, res){
  var conditions = {id_installation: req.body.id_installation, id_employee: req.body.id_employee};
  var query = {name: req.body.name};
  Employee.update(conditions, query, function(err){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};

exports.updateLastName =  function(req, res){
  var conditions = {id_installation: req.body.id_installation, id_employee: req.body.id_employee};
  var query = {last_name: req.body.last_name};
  console.log(query)
  Employee.update(conditions, query, function(err){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};

exports.updateCategory =  function(req, res){
  var conditions = {id_installation: req.body.id_installation, id_employee: req.body.id_employee};
  var query = {category: req.body.category};
  Employee.update(conditions, query, function(err){
    if(!err){
      res.send({status: true});
    }
    else{
      res.send({status: false});
    }
  });
};

exports.categoriesList =  function(req, res){
  Category.find({
    id_installation: req.body.id_installation
  }).exec(function(err, categories) {
    res.send({
      categories: categories
    });
  });
};

exports.employeesListByCategory =  function(req, res){
  Employee.find({
    id_installation: req.body.id_installation,
    category: req.body.category
  }).exec(function(err, employees) {
    res.send({
      employees: employees
    });
  });
};

exports.tracking =  function(req, res){
  var current = req.body.date.split("/");
  var day = current[0];
  var month = current[1];
  var year = current[2];

  var start = new Date(year, month-1, day,0,0,0,0);
  var end = new Date(year, month-1, day,0,0,0,0);
  end.setDate(start.getDate()+1)
  
  Employee.findOne({
    id_installation: req.body.id_installation,
    id_employee: req.body.id_employee
  })
  .select("track")
  .sort({"track.register_at": -1})
  .exec(function(err, employee) {
    var actualTrack = [];
    for(i in employee.track){
      var trackDate = new Date(employee.track[i].register_at);
      if(trackDate >= start && trackDate < end){
        actualTrack.push(employee.track[i])
      }
    }
    res.send({
      track: actualTrack
    });
  });
};

function isPrime(n) {
  if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
  var m=Math.sqrt(n);
  for (var i=2;i<=m;i++) if (n%i==0) return false;
  return true;
}

function primeBetween(low,high){
  low = parseInt(low,16);
  high = parseInt(high,16);
  var x = Math.floor(Math.random() * (high - low) + low);
  while(!isPrime(x)){
    x = Math.floor(Math.random() * (high - low) + low);
  }
  return x;
}

function hashCalculate(id_installation,id_employee,name,date){
  var id = id_installation + id_employee + name;
  var input = id + date.toString();

  var a = primeBetween("0FF","FFF");
  var b = parseInt("1FFF",16);

  var j = 0;
  for(var i = 0; i<input.length; i++){
    a = a ^ input.charCodeAt(i);
    if(j<id.length)
      b = b ^ a ^ id.charCodeAt(j);
    j++;
  }
  return (a.toString(16) + b.toString(16));
}
