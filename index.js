var http = require('http');
var Color = require('color');

module.exports = {
  light: light
}

function light(user, ip, id) {
  var options = {
    host: ip,
    path: '/api/' + user + '/lights/' + id + '/state',
    method: 'PUT'
  };
  var _color = '#ffffff'

  this.on = function(color) {
    color = color || _color;
    var hueSettings = strToHuehsb(color);
    hueSettings.on = true

    return setLight(hueSettings);
  }

  this.off = function() {
    return setLight({on: false});
  }

  return this;

  function setLight(settings) {
    var body = JSON.stringify(settings);
    return http.request(options).on('error', err).end(body);
  }
}

function err(e) {
  console.log('problem with request: ' + e.message);
}

function strToHuehsb(str){
  var color = Color(str);
  var obj = color.hsv();

  return {
    sat: of255(obj.s),
    bri: of255(obj.v),
    hue: scaleToGamut(obj.h)
  }

  function scaleToGamut(deg) {
    return Math.round((deg / 360) * 65535);
  }

  function of255(num){
    return Math.round((num / 100) * 255);
  }
}
