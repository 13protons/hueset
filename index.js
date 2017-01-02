var request = require('request');
var http = require('http');
var Color = require('color');

module.exports = {
  light: light
}
var defaults = require('./defaults.js');

function light(user, ip, id) {
  user = user || defaults.user;
  ip = ip || defaults.ip;
  id = id || defaults.light;

  this.config = {
    on: undefined,
    color: undefined
  };

  var getUrl = 'http://' + ip + '/api/' + user + '/lights/' + id
  var options = {
    host: ip,
    path: '/api/' + user + '/lights/' + id + '/state',
    method: 'PUT',
    transitiontime: 1
  };

  get(function(err, config){
    if (!err) {
      this.config = config;
    }
  });

  this.on = function(color) {
    var hueSettings = {};

    if (color) {
      hueSettings = strToHuehsb(color);
    }

    if (!this.config.on) {
      hueSettings.on = true
      this.config.on = true
    }

    options.method = 'PUT';
    return setLight(hueSettings, options);
  }

  this.off = function() {
    this.config.on = false;
    options.method = 'PUT';
    return setLight({on: false}, options);
  }

  this.get = get

  function get(cb) {
    return getLight(getUrl, cb);
  }

  return this;
}

function getLight(options, cb) {
  if (typeof(cb) !== 'function'){
     cb = function(){};
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var res = processState(JSON.parse(body));
      cb(null, res)
    } else {
      cb(error, body);
    }
  })
}

function processState(light) {
  return {
    on: light.state.on,
    color: hueHsbToColor(light.state)
  }
}

function setLight(settings, options) {
  var body = JSON.stringify(settings);
  return http.request(options).on('error', err).end(body);
}

function err(e) {
  console.log('problem with request: ' + e.message);
}

function hueHsbToColor(light) {

  var saturation = light.sat || 0;
  var hue = unscaleHue(light.hue || 0);
  var brightness = of255(light.bri || 0);

  var hsvArr = [hue, saturation, brightness];
  return Color.hsv(hsvArr);

  function unscaleHue(deg) {
    return Math.round((deg / 65535) * 360);
  }
  function of255(num){
    return Math.round((num / 255) * 100);
  }
}

function strToHuehsb(str){
  var color = Color(str);
  var obj = color.hsv().object();

  return {
    sat: to255(obj.s),
    bri: to255(obj.v),
    hue: scaleToGamut(obj.h)
  }

  function scaleToGamut(deg) {
    return Math.round((deg / 360) * 65535);
  }
  function to255(num){
    return Math.round((num / 100) * 255);
  }
}
