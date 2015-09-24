module.exports = function(){

  var signals = [];

  this.addSignal = function(sg){
    signals.push(sg);
  }

  this.signals = function(){
    var print = [];
    for(var i=0; i<signals.length; i++){
      print.push(signals[i].toString());
    }
    return print;
  }

  this.solve = function(){
    if(signals.length > 3){
      signals.sort(signals[0].compare);
      signals.length = 3;
    }
    if(signals.length == 3){
      return solveThree(signals);
    }
    else if(signals.length == 2){
      return solveTwo(signals);
    }
    else if(signals.length == 1){
      return {
        x: signals[0].data().x,
        y: signals[0].data().y
      };
    }
    else{
      return {
        x: 0,
        y: 0
      };
    }
  }

  //Calc equations:

  function solveThree(signals){
    var a = signals[0];
    var b = signals[1];
    var c = signals[2];
    var eqAB = radicalEquation(a,b);
    var eqAC = radicalEquation(a,c);
    return cramerSolve(eqAB,eqAC);
  }

  function radicalEquation(a,b){
    return {
      x: 2*b.x-2*a.x,
      y: 2*b.y-2*a.y,
      c: -1*(sq(a.x)+sq(a.y)-sq(a.c)+sq(b.c)-sq(b.x)-sq(b.y))
    }
  }

  function cramerSolve(a,b){
    return {
      x: (a.c*b.y-a.y*b.c)/(a.x*b.y-b.x*a.y),
      y: (a.x*b.c-b.x*a.c)/(a.x*b.y-b.x*a.y)
    }
  }

  function solveTwo(signals){
    var a = signals[0];
    var b = signals[1];
    var subs = solveSubstitution(a,b);
    var s = solveEquation(subs);
    return {
      x: (s.x1 + s.x2) / 2,
      y: (s.y1 + s.y2) / 2
    }
  }

  function solveSubstitution(a,b){
    var p = {
      a : (2*a.y-2*b.y),
      b : -sq(a.x)-sq(a.y)+sq(a.c)-sq(b.c)+sq(b.x)+sq(b.y),
      c : 2*b.x-2*a.x
    }    
    return {
      a: (sq(p.a)/sq(p.c))+1,
      b: ((2*p.a*p.b)/sq(p.c))-2*a.y-(2*a.x*p.a)/p.c,
      c: (sq(p.b)/sq(p.c))-(2*a.x*p.b)/p.c+sq(a.x)+sq(a.y)-sq(a.c),
      x: p
    }
  }

  function solveEquation(eq){
    var y1 = (-eq.b+sqrt(sq(eq.b)-4*eq.a*eq.c))/(2*eq.a);
    var y2 = (-eq.b-sqrt(sq(eq.b)-4*eq.a*eq.c))/(2*eq.a);
    return {
      x1: ((eq.x.a*y1)+eq.x.b)/eq.x.c,
      y1: y1,
      x2: ((eq.x.a*y2)+eq.x.b)/eq.x.c,
      y2: y2
    }
  }

  //Funciones comunes:

  function sq(x){
    return x*x;
  }

  function sqrt(x){
    return Math.sqrt(x);
  }
  return this;
}