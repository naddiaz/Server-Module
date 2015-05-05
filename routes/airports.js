async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');

exports.index =  function(req, res){
  res.setLocale('en');
  Airport.find({}).exec(function(err,airports){
    res.render('airport',{
        location: req.params.location,
        name: req.params.name,
        airports: airports
    });
  })
};
      


exports.tasksStates =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var Tasks = Task.find({id_airport: airport.id_airport}).sort({id_task: -1});
    var Works = Work.find({id_airport: airport.id_airport}).populate('person task');
    var data = {
      tasks: Tasks.exec.bind(Tasks),
      works: Works.exec.bind(Works),
    };
    async.parallel(data,function(err,results){
      /*
      Búsqueda de tareas sin asignar o parcialmente asignadas
      
      Recuento de tareas: activas, completadas y pendientes
      Una tarea puede comtemplar varios trabajos por lo que puede estar:
        - Completada: si todos los trabajos que pertenezcan a esa tarea también lo están.
        - Pendiente: si ningún trabajo asociado se ha empezado a ejecutar (running).
        - Activa: si alguno de los trabajos asociados se ha empezado.
      */
      var tasks_active = new Array();
      var tasks_pending = new Array();
      var tasks_complete = new Array();
      var tasks_nonasign = new Array();
      for(var i=0; i<results.tasks.length; i++){
        var full_completed = 0;
        var running = 0;
        var partial_asign = 0;
        var pending = 0;
        for(var j=0; j<results.works.length; j++){
          if(results.tasks[i]._id.toString() == results.works[j].task._id.toString()){
            partial_asign++;
            if(results.works[j].state.toString() == 'complete' )
              full_completed++;
            else if(results.works[j].state.toString() == 'active' )
              running++;
            else if(results.works[j].state.toString() == 'asign' || results.works[j].state.toString() == 'pause')
              pending++;
          }
        }
        if(full_completed == results.tasks[i].n_employees){
          tasks_complete.push(results.tasks[i]);
        }
        else if(running > 0){
          tasks_active.push(results.tasks[i]);
        }
        else if(pending > 0){
          tasks_pending.push(results.tasks[i]);
        }
        if(results.tasks[i].n_employees - partial_asign != 0){
          results.tasks[i].pending = (results.tasks[i].n_employees - partial_asign);
          tasks_nonasign.push({task:results.tasks[i],pending:results.tasks[i].pending});
        }
      }
      res.send(
        {
          tasks_complete: tasks_complete,
          tasks_active: tasks_active,
          tasks_pending: tasks_pending,
          tasks_nonasign: tasks_nonasign
        }
      );
    });
  });
};

exports.worksStates =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    Work.find({id_airport: airport.id_airport}).populate('person task').exec(function(err,works){
      /*
      Separación de los trabajos por el estado para mostrarlos ordenados enla diferentes tablas.
      */
      var works_active = new Array();
      var works_pending = new Array();
      var works_complete = new Array();
      var works_stop = new Array();
      for(var j=0; j<works.length; j++){
        if(works[j].state.toString() == 'complete')
          works_complete.push(works[j]);
        else if(works[j].state.toString() == 'active')
          works_active.push(works[j]);
        else if(works[j].state.toString() == 'asign')
          works_pending.push(works[j]);
        else if(works[j].state.toString() == 'cancel' || works[j].state.toString() == 'pause')
          works_stop.push(works[j]);
      }

      res.send({
        works_complete: works_complete,
        works_active: works_active,
        works_pending: works_pending,
        works_stop: works_stop
      });
    });
  });
};

exports.employeesStates =  function(req, res){
  Airport.findOne({location: req.body.location, name: req.body.name }).select('id_airport').exec(function(err, airport){
    var People = Person.find({id_airport: airport.id_airport});
    var Works = Work.find({id_airport: airport.id_airport}).populate('person task');
    var data = {
      people: People.exec.bind(People),
      works: Works.exec.bind(Works)
    };
    async.parallel(data,function(err,results){
      /*
        Categorización de los empleados:
          - Desocupado: si no tiene trabajos asociados.
          - Activo: si está ejecutando algún trabajo.
          - Pendiente: si tiene trabajos asignados pero no los ha empezado a realizar.
        Orden de restricción:
          - Activo > Pendiente > Desocupado
      */
      var employee = new Array();
      for(var i=0; i<results.people.length; i++){
        var active = false;
        var pending = false;
        for(var j=0; j<results.works.length; j++){
          //Si ha encontrado un trabajo para esta persona
          if(results.works[j].id_person == results.people[i].id_person && !active){
            //Si el estado es activo, deja de buscar y asigna activo al estado de esta persona
            if(results.works[j].state.toString() == 'active'){
              active = true;
              employee.push({'data':results.people[i],'state':"ACTIVO"});
            }
            //Si tiene alguno asignado lo ponemos en pending, porque puede que tenga alguno activo y según la prioridad, estaría como activo.
            else if(results.works[j].state.toString() == 'asign'){
              pending = true;
            }
          }
        }
        if(pending && !active){
          employee.push({'data':results.people[i],'state':"ESPERA"});
        }
        else if(!active){
          employee.push({'data':results.people[i],'state':"DESOCUPADO"});
        }
      }
      res.send({
        people: employee
      });
    });
  });
};