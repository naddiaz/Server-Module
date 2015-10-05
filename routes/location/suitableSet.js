module.exports = function(length,beacons,employees,activity,tasks){

  MAX = 30;

  function getSuitableSet(length){
    var selected = employeesInCluster(beacons,employees);
    distanceToActivity(selected,activity);
    tasksForEmployee(selected,tasks);
    calculateWeightForEmployees(selected);
    orderByWeight(selected);
    return selected.splice(0,length);
  }

  function employeesInCluster(beacons,employees){
    var selected = [];
    for(var i in beacons){
      var j = 0;
      while(employees.length > 0 && j < employees.length){
        var isSubstract = false;
        if(employees[j].track.length > 0){
          var distance = distanceBetweenTwoPoints(beacons[i].location,employees[j].track[employees[j].track.length-1].location);
          if(distance <= MAX){
            if(!isSelected(employees[j],selected)){
              selected.push(employees[j]);
              employees.splice(j, 1);
              isSubstract = true;
            }
          }
        }
        if(!isSubstract)
          j++;
      }
    }
    return selected;
  }

  function isSelected(employee,employees){
    var i = 0;
    while(i < employees.length){
      if(employee.id_employee == employees[i].id_employee){
        return true;
      }
      i++;
    }
    return false;
  }

  function distanceToActivity(employees,activity){
    for(var i in employees){
      var distance = distanceBetweenTwoPoints(activity.location,employees[i].track[employees[i].track.length-1].location);
      employees[i].distanceToActivity = distance;
    }
  }

  function tasksForEmployee(employees,tasks){
    for(var i in employees){
      var accComplete = 0;
      var accPending = 0;
      for(var j in tasks){
        if(employees[i].id_employee == tasks[j].id_employee){
          if(tasks[j].state > 1 && tasks[j].state < 4)
            accPending += tasks[j].time;
          if(tasks[j].state == 4 || tasks[j].state == 5)
            accComplete += tasks[j].time;
        }
      }
      employees[i].timeComplete = accComplete;
      employees[i].timePending = accPending;
    }
  }

  function calculateWeightForEmployees(employees){
    for(var i in employees){
      employees[i].weight = 
        parseFloat(employees[i].distanceToActivity) 
        + 0.4*parseFloat(employees[i].timeComplete) 
        + 0.6*parseFloat(employees[i].timePending); 
    }
  }

  function orderByWeight(employees){
    var compare = function(a, b) {
      if (a.weight < b.weight) {
        return -1;
      }
      if (a.weight > b.weight) {
        return 1;
      }
      return 0;
    }
    employees.sort(compare);
  }

  function translateLatLng(obj){
    return {
      lat: parseFloat(obj.latitude),
      lng: parseFloat(obj.longitude)
    }
  }

  function distanceBetweenTwoPoints(pointA,pointB){
    rad = function(x) {
      return x*Math.PI/180;
    }
    
    coordsA = translateLatLng(pointA);
    coordsB = translateLatLng(pointB);

    var R     = 6378.137;
    var dLat  = rad( coordsB.lat - coordsA.lat );
    var dLong = rad( coordsB.lng - coordsA.lng );

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(coordsA.lat)) * Math.cos(rad(coordsB.lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return (d * 1000).toFixed(6);
  }

  return getSuitableSet(length);
}