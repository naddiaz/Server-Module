async = require("async");

var Mongoose = require( 'mongoose' );
var Person     = Mongoose.model( 'Person' );
var Task     = Mongoose.model( 'Task' );
var Airport     = Mongoose.model( 'Airport' );
var Work = Mongoose.model('Work');

exports.index =  function(req, res){
  Airport.findOne({location: req.params.location, name: req.params.name }).select('id_airport').exec(function(err, airport){
    var Tasks = Task.find({id_airport: airport.id_airport}).sort({id_task: -1});
    var People = Person.find({id_airport: airport.id_airport});
    var Works = Work.find({id_airport: airport.id_airport}).populate('person task');
    var Airports = Airport.find({});
    var data = {
      tasks: Tasks.exec.bind(Tasks),
      people: People.exec.bind(People),
      works: Works.exec.bind(Works),
      airports: Airports.exec.bind(Airports)
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
        for(var j=0; j<results.works.length; j++){
          if(results.tasks[i]._id.toString() == results.works[j].task._id.toString()){
            partial_asign++;
            console.log(results.works[j].state.toString())
            if(results.works[j].state.toString() == 'finish' )
              full_completed++;
            else if(results.works[j].state.toString() == 'running' )
              running++;
          }
        }
        if(full_completed == results.tasks[i].n_employees){
          tasks_complete.push(results.tasks[i]);
        }
        else if(running > 0){
          tasks_active.push(results.tasks[i]);
        }
        else{
          tasks_pending.push(results.tasks[i]);
        }
        if(results.tasks[i].n_employees - partial_asign != 0){
          results.tasks[i].pending = results.tasks[i].n_employees - partial_asign;
          tasks_nonasign.push(results.tasks[i]);
        }
      }

      /*
      Separación de los trabajos por el estado para mostrarlos ordenados enla diferentes tablas.
      */
      var works_active = new Array();
      var works_pending = new Array();
      var works_complete = new Array();
      var works_stop = new Array();
      for(var j=0; j<results.works.length; j++){
        if(results.works[j].state.toString() == 'finish')
          works_complete.push(results.works[j]);
        else if(results.works[j].state.toString() == 'running')
          works_active.push(results.works[j]);
        else if(results.works[j].state.toString() == 'asign')
          works_pending.push(results.works[j]);
        else if(results.works[j].state.toString() == 'cancel' || results.works[j].state.toString() == 'pause')
          works_stop.push(results.works[j]);
      }

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
          if(results.works[j].id_person == results.people[i].id_person){
            //Si el estado es activo, deja de buscar y asigna activo al estado de esta persona
            if(results.works[j].state.toString() == 'running'){
              active = true;
              results.people[i].state = "ACTIVO";
              employee.push(results.people[i]);
            }
            //Si tiene alguno asignado lo ponemos en pending, porque puede que tenga alguno activo y según la prioridad, estaría como activo.
            else if(results.works[j].state.toString() == 'asign'){
              pending = true;
            }
          }
        }
        if(pending && !active){
          results.people[i].state = "ESPERA";
          employee.push(results.people[i]);
        }
        else if(!active){
          results.people[i].state = "DESOCUPADO";
          employee.push(results.people[i]);
        }
      }
      //console.log(employee)

      res.render(
        'airport',
        {
          location: req.params.location,
          name: req.params.name,
          people: employee,
          tasks_complete: tasks_complete,
          tasks_active: tasks_active,
          tasks_pending: tasks_pending,
          tasks_nonasign: tasks_nonasign,
          works_complete: works_complete,
          works_active: works_active,
          works_pending: works_pending,
          works_stop: works_stop,
          airports: results.airports
        }
      );
    });
  });
};
