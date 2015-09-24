module.exports = function(latitude,longitude,powerDbm,txPowerAtSource){
  /*
   *
   * FSPL_FREQ = 20*log10(f) = 20*log10(2.45 * 10^9) = 188.78
   * FSPL_LIGHT = 20*log10(4*pi/c) = 20*log10(4pi/2.9979*10^8) = -147.55
   * PATH_LOSS_AT_1M = FSPL_FREQ + FSPL_LIGHT = 188.78 - 147.55 = 41.23
   * FREE_SPACE_PATH_LOSS_CONSTANT_FOR_BLE = FSPL_FREQ + FSPL_LIGHT; // const = 41
   *
   */

  this.rssiToDistance = function(rssi,txPowerAtSource){
    var pathLoss = txPowerAtSource - rssi;
    var FREE_SPACE_PATH_LOSS_CONSTANT_FOR_BLE = 41;
    return Math.pow(10, (pathLoss - FREE_SPACE_PATH_LOSS_CONSTANT_FOR_BLE) / 20.0);
  }

  var x = latitude;
  var y = longitude;
  var c = this.rssiToDistance(powerDbm,txPowerAtSource)/100000;

  this.data = function(){
    return {
      x: x,
      y: y,
      c: c
    };
  }

  this.x = function(){
    return x;
  }

  this.y = function(){
    return y;
  }

  this.c = function(){
    return c;
  }

  this.middlePoint = function(other){
    var a = (x+other.x())/2;
    var b = (y+other.y())/2;
    return {
      x: a,
      y: b
    };
  }

  this.distanceBetween = function(other){
    rad = function(x) {
      return x*Math.PI/180;
    }

    var R     = 6378.137;
    var dLat  = rad( other.x() - this.x() );
    var dLong = rad( other.y() - this.y() );

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(this.x())) * Math.cos(rad(other.x())) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return (d * 1000).toFixed(6);
  }

  this.compare = function(a,b) {
    if (a.c < b.c)
      return -1;
    if (a.c > b.c)
      return 1;
    return 0;
  }

  this.toString = function(){
    return {
      x : x,
      y : y,
      c : c*100000
    };
  }

  return {
    x : x,
    y : y,
    c : c,
    distanceBetween: this.distanceBetween,
    middlePoint: this.middlePoint,
    data: this.data,
    compare: this.compare,
    toString: this.toString
  };

}